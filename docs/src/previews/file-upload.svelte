<script lang="ts">
	import { usePreviewControls } from "@components/preview-ctx.svelte";
	import Preview from "@components/preview.svelte";
	import { getters } from "melt";
	import { FileUpload } from "melt/builders";
	import { SvelteSet } from "svelte/reactivity";
	import UploadIcon from "~icons/tabler/cloud-upload";
	import XIcon from "~icons/tabler/x";

	const controls = usePreviewControls({
		multiple: {
			type: "boolean",
			label: "Multiple files",
			defaultValue: true,
		},
		avoidDuplicates: {
			type: "boolean",
			label: "Avoid duplicates",
			defaultValue: true,
		},
		accept: {
			type: "string",
			label: "Accept",
			defaultValue: "",
		},
		maxSize: {
			type: "number",
			label: "Max size (bytes)",
			defaultValue: 5 * 1024 * 1024, // 5MB
		},
	});

	const fileUpload = new FileUpload({
		...getters(controls),
		selected: [new File([""], "empty.txt", { type: "text/plain" })],
		onError: (e) => {
			console.log(e);
		},
	});

	const files = $derived.by(() => {
		if (fileUpload.selected instanceof SvelteSet) {
			return Array.from(fileUpload.selected);
		}
		return [fileUpload.selected].filter((f): f is File => !!f);
	});

	function formatFileSize(bytes: number) {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	}
</script>

<Preview>
	<div class="flex flex-col items-center gap-4">
		<input {...fileUpload.input} />
		<div
			{...fileUpload.dropzone}
			class="relative flex min-h-[200px] w-[300px] cursor-pointer
				flex-col items-center justify-center gap-4
				rounded-xl border-2 border-dashed border-gray-300 bg-gray-50
				p-6 text-center transition-colors
				hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
			class:!border-accent-500={fileUpload.isDragging}
		>
			{#if fileUpload.isDragging}
				<p class="text-accent-400 font-medium">Drop files here</p>
			{:else}
				<div class="pointer-events-none flex flex-col items-center gap-2">
					<UploadIcon class="text-4xl" />

					<p class="text-sm text-gray-500 dark:text-gray-400">
						<span class="font-semibold text-gray-900 dark:text-white">Click to upload</span>
						or drag and drop
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">
						{controls.accept}
						{#if controls.maxSize}
							<span>(up to {formatFileSize(controls.maxSize)})</span>
						{/if}
					</p>
				</div>
			{/if}
		</div>

		{#if files.length > 0}
			<ul class="w-[300px] list-none divide-y divide-gray-200 p-0 dark:divide-gray-700">
				{#each files as file}
					<li class="flex items-center gap-2 overflow-hidden py-3">
						<div class="flex min-w-0 flex-1 items-center justify-between gap-8">
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium text-gray-900 dark:text-white">
									{file.name}
								</p>
								<p class="truncate text-xs text-gray-500 dark:text-gray-400">{file.type}</p>
							</div>
							<div class="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
								{formatFileSize(file.size)}
							</div>
						</div>
						<button
							class="grid place-items-center bg-transparent text-gray-500
							hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-300"
							onclick={() => {
								fileUpload.remove(file);
							}}
						>
							<XIcon />
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</Preview>
