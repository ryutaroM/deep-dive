<header>
	<h1>Deep Dive</h1>
</header>

<style>
	header {
		width: 100vw;
		position: relative;
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-light);
		background: linear-gradient(135deg, var(--primary-start) 0%, var(--primary-end) 100%);
		overflow: hidden;
		margin-left: calc(-50vw + 50%);
	}

	header::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 1px, transparent 1px);
		background-size: 30px 30px;
		animation: float 6s ease-in-out infinite;
	}

	header::after {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 2px, transparent 2px);
		background-size: 50px 50px;
		animation: float 8s ease-in-out infinite reverse;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		50% {
			transform: translateY(-20px) rotate(180deg);
		}
	}

	header h1 {
		position: relative;
		z-index: 1;
		color: white;
		text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: 0.5px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
	}
</style>
