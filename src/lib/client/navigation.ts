import { goto } from '$app/navigation';

export async function navigateWithGoto(url: string): Promise<void> {
    await goto(url);
}
