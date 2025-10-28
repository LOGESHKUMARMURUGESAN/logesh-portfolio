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

// Copy buttons for contact details (email / phone)
document.addEventListener('click', function (e) {
    const btn = e.target.closest && e.target.closest('.contact-copy');
    if (!btn) return;
    const value = btn.getAttribute('data-copy');
    if (!value) return;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(value).then(() => {
            const original = btn.innerHTML;
            btn.innerHTML = 'Copied';
            btn.classList.add('btn-success');
            btn.classList.remove('btn-outline-secondary');
            setTimeout(() => {
                btn.innerHTML = original;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-outline-secondary');
            }, 1800);
        }).catch(() => {
            // fallback: select text
            const tmp = document.createElement('input');
            document.body.appendChild(tmp);
            tmp.value = value;
            tmp.select();
            try { document.execCommand('copy'); }
            catch (err) {}
            document.body.removeChild(tmp);
        });
    }
});

// Skill card click -> populate and show modal
(function () {
	document.addEventListener('DOMContentLoaded', function () {
		const modalEl = document.getElementById('skillModal');
		if (!modalEl) return; // modal not present
		const bsModal = new bootstrap.Modal(modalEl);

		function openSkillModal(card) {
            const titleEl = card.querySelector('h4');
            const shortEl = card.querySelector('p');
            const detailEl = card.querySelector('.skill-detail');
            const iconEl = card.querySelector('img');
            const title = titleEl ? titleEl.textContent.trim() : 'Skill';
            
            // Create modal content with icon and proficiency meter
            const modalTitle = modalEl.querySelector('.modal-title');
            modalTitle.innerHTML = '';
            if (iconEl) {
                const icon = iconEl.cloneNode(true);
                icon.style.width = '48px';
                icon.style.height = '48px';
                modalTitle.appendChild(icon);
            }
            modalTitle.insertAdjacentText('beforeend', title);
            
            // Prepare modal body content with proficiency meter
            let content = '<div class="mb-4">';
            content += `<h6 class="fw-bold text-primary mb-2">Proficiency Level</h6>`;
            content += '<div class="proficiency-meter">';
            // Set proficiency level based on skill (you can customize these)
            const proficiencyMap = {
                'Backend Development': 90,
                'Cloud Services': 70,
                'Frontend Development': 75,
                'Database': 75,
                'DevOps & Management': 75
            };
            const proficiency = proficiencyMap[title] || 80;
            content += `<div class="fill" style="width: ${proficiency}%"></div>`;
            content += '</div>';
            
            // Add description and skills list
            if (detailEl) {
                content += detailEl.innerHTML;
            } else if (shortEl) {
                content += `<p>${shortEl.innerHTML}</p>`;
            }
            content += '</div>';
            
            modalEl.querySelector('.modal-body').innerHTML = content;
            
            // Add modal-specific classes
            modalEl.querySelector('.modal-dialog').classList.add('skill-modal');
            
            bsModal.show();
        }

		const cards = Array.from(document.querySelectorAll('.skill-card[role="button"]'));
		cards.forEach(card => {
			card.addEventListener('click', () => openSkillModal(card));
			card.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSkillModal(card); }
			});
		});
	});
})();

