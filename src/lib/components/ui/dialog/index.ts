import { Dialog as DialogPrimitive } from 'bits-ui';

import Root from './Dialog.svelte';
import Close from './DialogClose.svelte';
import Content from './DialogContent.svelte';
import Description from './DialogDescription.svelte';
import Footer from './DialogFooter.svelte';
import Header from './DialogHeader.svelte';
import Overlay from './DialogOverlay.svelte';
import Title from './DialogTitle.svelte';

const Portal = DialogPrimitive.Portal;
const Trigger = DialogPrimitive.Trigger;

export {
    Root,
    Title,
    Portal,
    Footer,
    Header,
    Trigger,
    Overlay,
    Content,
    Description,
    Close,
    //
    Root as Dialog,
    Title as DialogTitle,
    Portal as DialogPortal,
    Footer as DialogFooter,
    Header as DialogHeader,
    Trigger as DialogTrigger,
    Overlay as DialogOverlay,
    Content as DialogContent,
    Description as DialogDescription,
    Close as DialogClose
};
