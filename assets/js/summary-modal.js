/*
	Project summary pop-up.
	Plain JS (no jQuery/poptrox needed) so it behaves the same
	on desktop click and mobile tap. Reads its title/skills from
	data-title / data-skills, and its body content (Approach / Key
	Findings / Executive Summary) by cloning the <template> whose id
	is given in data-modal-template on each trigger.
*/

(function () {

	document.addEventListener('DOMContentLoaded', function () {

		var modal = document.getElementById('summary-modal');

		if (!modal) return;

		var titleEl = modal.querySelector('.summary-modal-title');
		var skillsEl = modal.querySelector('.summary-modal-skills');
		var bodyEl = modal.querySelector('.summary-modal-body');
		var linkEl = modal.querySelector('.summary-modal-link');
		var lastFocused = null;

		function openModal(trigger) {
			titleEl.textContent = trigger.getAttribute('data-title') || '';
			skillsEl.textContent = trigger.getAttribute('data-skills') || '';

			bodyEl.innerHTML = '';
			var tplId = trigger.getAttribute('data-modal-template');
			var tpl = tplId ? document.getElementById(tplId) : null;

			if (tpl) {
				bodyEl.appendChild(tpl.content.cloneNode(true));
			} else {
				// Fallback for older markup using a flat data-summary string.
				var p = document.createElement('p');
				p.textContent = trigger.getAttribute('data-summary') || '';
				bodyEl.appendChild(p);
			}

			var link = trigger.getAttribute('data-link');
			if (link) {
				linkEl.href = link;
				linkEl.hidden = false;
			} else {
				linkEl.hidden = true;
			}

			lastFocused = document.activeElement;

			modal.classList.add('is-active');
			modal.setAttribute('aria-hidden', 'false');
			document.body.classList.add('modal-open');

			var closeBtn = modal.querySelector('.summary-modal-close');
			if (closeBtn) closeBtn.focus();
		}

		function closeModal() {
			modal.classList.remove('is-active');
			modal.setAttribute('aria-hidden', 'true');
			document.body.classList.remove('modal-open');

			if (lastFocused && typeof lastFocused.focus === 'function') {
				lastFocused.focus();
			}
		}

		// Open on click/tap of any project thumbnail.
		var triggers = document.querySelectorAll('[data-summary-trigger]');
		for (var i = 0; i < triggers.length; i++) {
			triggers[i].addEventListener('click', function (e) {
				e.preventDefault();
				openModal(this);
			});
		}

		// Close on overlay click or close button.
		var closers = modal.querySelectorAll('[data-modal-close]');
		for (var j = 0; j < closers.length; j++) {
			closers[j].addEventListener('click', closeModal);
		}

		// Close on Escape.
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && modal.classList.contains('is-active')) {
				closeModal();
			}
		});

	});

})();
