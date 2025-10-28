// Reveal on scroll: add .visible to elements with .reveal and stagger their appearance
document.addEventListener('DOMContentLoaded', function () {
	const reveals = Array.from(document.querySelectorAll('.reveal'));
	if (!('IntersectionObserver' in window)) {
		// fallback: just show all
		reveals.forEach((el) => el.classList.add('visible'));
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const el = entry.target;
				// calculate an index-like delay based on position within its parent
				const parent = el.parentElement || el;
				const siblings = Array.from(parent.parentElement ? parent.parentElement.children : []);
				let idx = siblings.indexOf(parent);
				if (idx < 0) idx = 0;
				el.style.transitionDelay = (idx * 80) + 'ms';
				el.classList.add('visible');
				observer.unobserve(el);
			}
		});
	}, { threshold: 0.12 });

	reveals.forEach((el) => observer.observe(el));
});

// small enhancement: allow clicking badge to copy tech (optional UX)
document.addEventListener('click', function (e) {
	const t = e.target;
	if (t.classList && t.classList.contains('badge')) {
		const text = t.textContent.trim();
		if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
	}
});

