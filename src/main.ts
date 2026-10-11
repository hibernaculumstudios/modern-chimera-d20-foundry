import { registerSystem } from './foundry/register';

Hooks.once('init', registerSystem);
