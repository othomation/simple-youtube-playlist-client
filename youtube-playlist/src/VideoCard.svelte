<script>
	import { createEventDispatcher } from "svelte";

	export let videoInfo;
	const dispatch = createEventDispatcher();

	/* Emit event with some data (videoId, playlistId and videoTitle) */
	const playVideoByUrl = (event) => {
		event.preventDefault();
		const videoId = videoInfo.videoId;
		const playlistId = videoInfo.playlistId;
		const videoTitle = videoInfo.title;
		dispatch("videoId", {
			videoId,
			playlistId,
			videoTitle,
		});
	};
</script>

<div class="video__card">
	<figure class="video__card--figure">
		<a on:click={playVideoByUrl} href={videoInfo.link} class="video__card--figure--link"
			><img
				src={videoInfo.thumbnail}
				alt="Video thumbnail"
				class="video__card--figure--link--thumbnail"
			/></a
		>
	</figure>
	<p class="video__card--description">
		<em class="video__card--description--title">{videoInfo.title}</em>
		<span class="video__card--description--text">{videoInfo.description}</span>
	</p>
</div>

<style lang="scss">
	.video__card {
		background: var(--color);
		padding: 1rem;
		border-radius: 1em;
		margin: 1rem;
		display: flex;
		align-items: center;
		flex-direction: row;

		&--figure {
			min-width: 300px;
			flex: 1;

			&--link {
				max-width: 100%;
				max-height: 100%;
				&--thumbnail {
					max-width: 100%;
					max-height: 100%;
					object-fit: cover;
					border-radius: 2rem;
					box-shadow: 0 0 20px 0px #1d1d1d42;
				}
			}
		}

		&--description {
			max-width: 100%;
			max-height: 100%;
			flex: 4;
			padding: 1rem;
			&--title {
				display: block;
				text-align: center;
				font-size: 3rem;
				font-weight: bold;
				font-style: italic;
				color: var(--background);
				word-break: break-word;
				margin-bottom: 1rem;
			}
			&--text {
				color: var(--background);
				font-family: monospace;
				font-size: 2rem;
				line-height: 1.75rem;
				word-break: break-word;
				white-space: pre-line; // This is useful to deal with \n in response string from Youtube
			}
		}
	}

	@media all and (max-width: 1000px) {
		.video__card {
			flex-direction: column;
		}
	}
</style>
