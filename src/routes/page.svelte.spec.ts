import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render the header with Deep Dive title', async () => {
		render(Page);

		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
		await expect.element(heading).toHaveTextContent('Deep Dive');
	});

	it('should render the main workspace', async () => {
		render(Page);

		const main = page.getByRole('main');
		await expect.element(main).toBeInTheDocument();
	});

	it('should render the footer with copyright text', async () => {
		render(Page);

		const footer = page.getByText('© 2025 Deep Dive. All rights reserved.');
		await expect.element(footer).toBeInTheDocument();
	});
});
