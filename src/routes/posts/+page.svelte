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

	const topics = [
		"Artificial Intelligence",
		"Design",
		"Engineering",
		"Thoughts"
	];

	const allPosts = [
		{ title: 'Why Walking Clears the Mind', subtitle: 'The surprising benefits of a simple stroll', date: '2/3/24', link: '/posts/why-walking-clears-the-mind' },
		{ title: 'Why Nostalgia Shapes Modern Trends', subtitle: 'The pull of the past in a digital world', date: '11/20/24', link: '/posts/why-nostalgia-shapes-modern-trends' },
		{ title: 'The Philosophy of AI Ethics', subtitle: 'Can machines make moral decisions?', date: '1/23/25', link: '/posts/the-philosophy-of-ai-ethics' },
		{ title: 'Demystifying Continuous Integration', subtitle: 'How CI improves development workflows', date: '1/6/25', link: '/posts/demystifying-continuous-integration' },
		{ title: 'Why Code Reviews Are Essential', subtitle: 'The power of collaboration in coding', date: '7/1/24', link: '/posts/why-code-reviews-are-essential' },
		{ title: 'How AI Is Changing the Way We Work', subtitle: 'AI tools & their impact on productivity.', date: '1/16/25', link: '/posts/how-ai-is-changing-the-way-we-work' },
		{ title: 'The Ethics of Artificial Intelligence', subtitle: 'Balancing innovation with responsibility.', date: '1/9/25', link: '/posts/the-ethics-of-artificial-intelligence' },
		{ title: 'AI in Everyday Life', subtitle: 'AI is seamlessly woven into our daily routines.', date: '12/12/24', link: '/posts/ai-in-everyday-life' },
		{ title: 'The Role of Empathy in Design', subtitle: 'Why empathy is the key to great design.', date: '12/2/24', link: '/posts/the-role-of-empathy-in-design' },
		{ title: 'Why Microinteractions Matter in UX', subtitle: 'Small details, big impact on user experience.', date: '11/20/24', link: '/posts/why-microinteractions-matter-in-ux' },
		{ title: 'The Importance of Iteration in Design', subtitle: 'Iteration leads to better design outcomes.', date: '3/24/24', link: '/posts/the-importance-of-iteration-in-design' },
		{ title: 'The Rise of Edge Computing', subtitle: 'Why edge computing is the future of tech', date: '8/22/24', link: '/posts/the-rise-of-edge-computing' }
	];

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
					<a href="/posts" class="font-medium text-foreground hover:text-primary transition-colors" onclick={toggleMenu}>All posts</a>
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
				<a href="/posts" class="text-sm font-medium text-foreground hover:text-primary transition-colors">All posts</a>
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
		<div class="container max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-16">
			
			<!-- Topics Section -->
			<section class="space-y-6">
				<h2 class="text-3xl font-bold tracking-tight">Topics</h2>
				<ul class="flex flex-wrap gap-x-8 gap-y-3">
					{#each topics as topic}
						<a href="/topics/{topic.toLowerCase().replace(' ', '-')}" class="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer">
							<span class="text-zinc-500 group-hover:text-foreground transition-colors">↳</span>
							<span class="text-sm font-medium tracking-wide">{topic}</span>
						</a>
					{/each}
				</ul>
			</section>

			<!-- All Posts Section -->
			<section class="space-y-10">
				<h2 class="text-4xl font-bold tracking-tight text-white mb-8">All posts</h2>
				<ul class="space-y-2">
					{#each allPosts as post}
						<li class="group">
							<a href={post.link} class="flex flex-col md:flex-row md:items-center justify-between py-3 group-hover:bg-zinc-900/50 rounded-lg px-3 transition-colors -mx-3">
								<div class="flex items-center gap-3 relative">
									<ArrowRight class="h-5 w-5 text-primary opacity-0 -translate-x-4 absolute left-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
									<div class="space-y-1 transition-transform duration-300 ease-out group-hover:translate-x-8">
										<p class="text-lg font-medium group-hover:text-primary transition-colors">{post.title}</p>
										<p class="text-sm text-muted-foreground">{post.subtitle}</p>
									</div>
								</div>
								<span class="text-sm text-muted-foreground mt-2 md:mt-0 font-mono">{post.date}</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>

			<!-- Newsletter Section -->
			<section>
				<div class="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 md:p-12 space-y-8">
					<div class="flex items-baseline justify-between">
						<h2 class="text-3xl font-bold text-white">Newsletter</h2>
						<p class="text-zinc-400 italic">300+ readers</p>
					</div>
					<div class="w-full space-y-4">
						<div class="relative">
							<Input type="email" placeholder="Your email address" class="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-500 h-12 pr-32 rounded-full focus-visible:ring-0 focus-visible:bg-zinc-900 transition-colors duration-300" />
							<Button class="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent text-zinc-500 hover:text-white transition-colors duration-300 rounded-full px-4 h-auto py-1 flex items-center gap-2 cursor-pointer">
								<ArrowRight class="h-4 w-4" />
								Subscribe
							</Button>
						</div>
						<p class="text-sm text-zinc-400">
							“Love design, tech, and random thoughts? Subscribe to my newsletter — it’s like a good chat, in your inbox!”
						</p>
					</div>
				</div>
			</section>

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
