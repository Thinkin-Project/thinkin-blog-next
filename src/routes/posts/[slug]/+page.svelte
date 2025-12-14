<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Separator } from "$lib/components/ui/separator";
	import * as Avatar from "$lib/components/ui/avatar";
	import { 
		ArrowRight, 
		Menu,
		X
	} from "lucide-svelte";

	const links = [
		{ name: 'Medium', url: '#' },
		{ name: 'Substack', url: '#' },
		{ name: 'Twitter', url: '#' }
	];

	// Svelte 5 State
	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<div class="flex min-h-screen w-full flex-col md:flex-row bg-background text-foreground">
	
	<!-- Mobile Header (Visible only on mobile) -->
	<header class="md:hidden flex items-center justify-between p-6 border-b bg-background sticky top-0 z-50">
		<div class="flex items-center gap-3">
			<Avatar.Root class="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
				<Avatar.Image src="https://github.com/shadcn.png" alt="Frank Price" class="object-cover" />
				<Avatar.Fallback>FP</Avatar.Fallback>
			</Avatar.Root>
			<span class="font-bold text-lg">Frank Price</span>
		</div>
		<Button variant="ghost" size="icon" onclick={toggleMenu} class="cursor-pointer">
			<Menu class="h-6 w-6" />
		</Button>
	</header>

	<!-- Mobile Menu Overlay -->
	{#if isMenuOpen}
		<div class="fixed inset-0 z-50 bg-background flex flex-col p-6 md:hidden animate-in slide-in-from-left duration-300">
			<div class="flex items-center justify-between mb-8">
				<span class="font-bold text-lg">Menu</span>
				<Button variant="ghost" size="icon" onclick={toggleMenu} class="cursor-pointer">
					<X class="h-6 w-6" />
				</Button>
			</div>
			
			<nav class="flex flex-col text-lg">
				<div class="flex flex-col gap-4">
					<a href="/" class="font-medium text-muted-foreground hover:text-primary transition-colors" onclick={toggleMenu}>Home</a>
					<a href="/posts" class="font-medium text-muted-foreground hover:text-primary transition-colors" onclick={toggleMenu}>All posts</a>
					<a href="/contact" class="font-medium text-muted-foreground hover:text-primary transition-colors" onclick={toggleMenu}>Contact</a>
				</div>
				
				<Separator class="bg-zinc-800 my-8" />
				
				<div class="space-y-4">
					<p class="font-bold text-lg">Socials</p>
					{#each links as link}
						<a href={link.url} class="flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors group" onclick={toggleMenu}>
							{link.name} <ArrowRight class="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />
						</a>
					{/each}
				</div>

				<div class="mt-8">
					<Button variant="default" size="lg" class="w-full rounded-full bg-[#ec4899] hover:bg-[#db2777] text-white font-semibold shadow-sm cursor-pointer">
						Subscribe
					</Button>
				</div>
			</nav>
		</div>
	{/if}

	<!-- Left Sidebar (Desktop Profile) -->
	<nav class="hidden md:flex w-full md:w-80 md:sticky md:top-0 md:h-screen z-40 border-b md:border-b-0 md:border-r bg-background/95 backdrop-blur p-8 flex-col justify-between">
		<div class="space-y-6">
			<div class="flex items-center gap-4">
				<Avatar.Root class="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity">
					<Avatar.Image src="https://github.com/shadcn.png" alt="Frank Price" class="object-cover" />
					<Avatar.Fallback>FP</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<h2 class="text-xl font-bold tracking-tight">Frank Price</h2>
					<p class="text-sm text-muted-foreground">Updated Now</p>
				</div>
			</div>
			
			<div class="space-y-2 pt-6">
				<p class="text-sm text-muted-foreground leading-relaxed">
					Designer by day, writer by night. Crafting intuitive user experiences at the intersection of design, engineering, and AI.
				</p>
			</div>

			<!-- Navigation Links -->
			<div class="flex flex-col gap-3 pt-2">
				<a href="/" class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</a>
				<a href="/posts" class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">All posts</a>
				<a href="/contact" class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</a>
			</div>
		</div>

		<div class="mt-8 md:mt-auto pt-6 space-y-4">
			<Button variant="default" size="sm" class="w-full rounded-full bg-[#ec4899] hover:bg-[#db2777] text-white font-semibold shadow-sm cursor-pointer">
				Subscribe
			</Button>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="flex-1">
		<div class="container max-w-3xl mx-auto px-6 py-8 md:py-12 space-y-16">
			
			<!-- Breadcrumb -->
			<div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
				<a 
					href="/posts" 
					class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-zinc-900 hover:bg-zinc-800 hover:text-accent-foreground  px-2 py-1 text-zinc-400 group"
				>
					<ArrowRight class="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
					All posts
				</a>
			</div>

			<!-- Article Header -->
			<article class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
				<header class="space-y-8">
					<div class="space-y-4">
						<h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
							Why Walking Clears the Mind
						</h1>
						<p class="text-xl md:text-2xl text-zinc-500 font-light">
							The surprising benefits of a simple stroll
						</p>
					</div>

					<div class="flex items-center gap-16 text-sm">
						<div class="space-y-1">
							<span class="text-zinc-500 block">Published</span>
							<span class="text-white font-medium block">Feb 3, 2024</span>
						</div>
						<div class="space-y-1">
							<span class="text-zinc-500 block">Topic</span>
							<span class="text-white font-medium block">Thoughts</span>
						</div>
					</div>
				</header>

				<!-- Hero Image Placeholder -->
				<div class="w-full aspect-[2/1] bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden flex items-center justify-center">
					<span class="text-zinc-700 italic">Hero Image</span>
				</div>

				<!-- Body Content -->
				<div class="prose prose-invert prose-zinc max-w-none space-y-8 text-lg leading-relaxed text-zinc-400">
					<p>
						A normal-sized paragraph introducing the theme. Walking isn't just a physical activity; it's a mental reset button that has been used by thinkers throughout history.
					</p>

					<div class="space-y-4">
						<h2 class="text-2xl font-bold text-white tracking-tight">The Science of Walking</h2>
						<p>
							Recent studies suggest that the rhythm of walking affects our brainwaves. It promotes a state of relaxed alertness that is ideal for creative thinking.
						</p>
						<ul class="list-disc pl-6 space-y-2 marker:text-zinc-600">
							<li><strong class="text-white">Physical Benefits</strong>: Improved circulation and energy levels.</li>
							<li><strong class="text-white">Mental Benefits</strong>: Reduced anxiety and enhanced cognitive flexibility.</li>
						</ul>
					</div>

					<div class="space-y-6">
						<h2 class="text-2xl font-bold text-white tracking-tight">Walking as Meditation</h2>
						<p>
							You don't need a destination. The act of moving itself triggers a flow state.
						</p>
						
						<!-- Tip Box -->
						<div class="p-4 border-l-2 border-zinc-700 bg-zinc-900/30 text-base italic text-zinc-400">
							Tip: Leave your phone behind and let your thoughts wander.
						</div>

						<!-- Blockquote -->
						<blockquote class="pl-6 border-l-0 text-2xl italic font-serif text-zinc-500 loading-relaxed">
							“A walk is not just a break; it’s a tool for clarity.”
						</blockquote>
					</div>

					<div class="space-y-4">
						<h2 class="text-2xl font-bold text-white tracking-tight">Make It a Habit</h2>
						<p>
							Start small. A 15-minute walk during your lunch break can be enough to reset your perspective for the afternoon.
						</p>
					</div>
				</div>
			</article>

			<!-- Bottom Navigation -->
			<div class="flex items-center justify-between pt-8 border-zinc-900">
				<a 
					href="#" 
					class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-zinc-900 hover:bg-zinc-800 hover:text-accent-foreground  px-2 py-1 text-zinc-400 group"
				>
					<ArrowRight class="mr-2 h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
					Previous
				</a>
				<a 
					href="#" 
					class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-zinc-900 hover:bg-zinc-800 hover:text-accent-foreground  px-2 py-1 text-zinc-400 group"
				>
					Next
					<ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</a>
			</div>

			<!-- Footer Section -->
			<footer class="pt-8 border-t border-border space-y-8">
				<div class="flex flex-row justify-between gap-8">
					<div class="flex flex-col justify-end text-sm text-muted-foreground text-right">
						<p>From Boston with ♡</p>
					</div>
					<div class="flex flex-col justify-end text-sm text-muted-foreground text-right">
						<p>© 2025 Frank Price</p>
					</div>
				</div>
			</footer>

		</div>
	</main>
</div>
