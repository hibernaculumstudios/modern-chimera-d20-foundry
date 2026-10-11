import { test, expect } from '@playwright/test';
import type { Browser, Page } from '@playwright/test';

async function join(browser: Browser, name: string) {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  // This suite exercises documents and sheets, not the GPU canvas.
  await context.addInitScript(() => localStorage.setItem('core.noCanvas', 'true'));
  const page = await context.newPage();
  await page.goto('/join');
  await page.locator('input[name="username"]').fill(name);
  await page.locator('input[name="password"]').fill(process.env.FOUNDRY_E2E_PASSWORD ?? '');
  await page.locator('button[name="join"]').click();
  await page.waitForFunction(() => typeof game !== 'undefined' && game.ready === true, undefined, {
    timeout: 30_000,
  });
  const configure = page.getByRole('button', { name: 'Save Player Configuration', exact: true });
  if (await configure.isVisible()) await configure.click();
  expect(await page.evaluate(() => game.world?.id)).toBe('mcd20-dev');
  expect(await page.evaluate(() => game.system?.id)).toBe('modern-chimera-d20');
  return { context, page };
}

async function biography(page: Page, id: string) {
  return page.evaluate((actorId) => {
    const source = game.actors?.get(actorId)?.toObject();
    return source?.system;
  }, id);
}

test('profile persists and synchronizes across GM, owner, and observer with permission enforcement', async ({
  browser,
}) => {
  const gm = await join(browser, 'Test GM');
  const owner = await join(browser, 'Test Owner');
  const observer = await join(browser, 'Test Observer');
  let actorId: string | undefined;
  try {
    actorId = await gm.page.evaluate(async () => {
      const ownerUser = game.users?.getName('Test Owner');
      const observerUser = game.users?.getName('Test Observer');
      if (!ownerUser || !observerUser) throw new Error('Missing test users. See local-testing.md.');
      const actor = await Actor.create({
        name: 'E2E Profile',
        type: 'character',
        ownership: {
          default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
          [ownerUser.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
          [observerUser.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
        },
      });
      if (!actor) throw new Error('Actor creation failed.');
      return actor.id;
    });
    await owner.page.waitForFunction((id) => !!game.actors?.get(id), actorId);
    await observer.page.waitForFunction((id) => !!game.actors?.get(id), actorId);
    await owner.page.evaluate(async (id) => {
      await game.actors?.get(id)?.sheet?.render(true);
    }, actorId);
    const field = owner.page.locator('.modern-chimera-d20 textarea[name="system.biography"]');
    await expect(field).toBeVisible();
    const value = '<script>throw new Error("untrusted text")</script> profile';
    await field.fill(value);
    await field.blur();
    await expect.poll(() => biography(gm.page, actorId!)).toMatchObject({ biography: value });
    await expect.poll(() => biography(observer.page, actorId!)).toMatchObject({ biography: value });
    owner.page.once('dialog', async (dialog) => {
      if (dialog.type() === 'beforeunload') await dialog.accept();
      else await dialog.dismiss();
    });
    await owner.page.reload({ waitUntil: 'domcontentloaded' });
    await owner.page.waitForFunction(
      () => typeof game !== 'undefined' && game.ready === true,
      undefined,
      { timeout: 30_000 },
    );
    await expect.poll(() => biography(owner.page, actorId!)).toMatchObject({ biography: value });
    const denied = await observer.page.evaluate(async (id) => {
      const actor = game.actors?.get(id);
      if (!actor) throw new Error('Missing synchronized actor.');
      try {
        await actor.update({ system: { biography: 'unauthorized' } });
        return false;
      } catch {
        return true;
      }
    }, actorId);
    expect(denied).toBe(true);
    await expect.poll(() => biography(gm.page, actorId!)).toMatchObject({ biography: value });
    await observer.page.evaluate(async (id) => {
      await game.actors?.get(id)?.sheet?.render(true);
    }, actorId);
    await expect(observer.page.locator('.modern-chimera-d20 textarea')).toBeDisabled();
  } finally {
    if (actorId && !gm.page.isClosed())
      await gm.page.evaluate(async (id) => {
        await game.actors?.get(id)?.delete();
      }, actorId);
    await Promise.all([gm.context.close(), owner.context.close(), observer.context.close()]);
  }
});
