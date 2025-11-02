if (!customElements.get('details-disclosure')) {
class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));

    // BUGFIX: Bind click-outside handler for closing dropdown when clicking outside
    this.boundClickOutside = this.handleClickOutside.bind(this);
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  // BUGFIX: Handle clicks outside the dropdown to close it
  handleClickOutside(event) {
    // If click is outside this element and dropdown is open, close it
    if (!this.contains(event.target) && this.mainDetailsToggle.hasAttribute('open')) {
      this.close();
    }
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());

      // BUGFIX: Add click-outside listener when dropdown opens
      // Delay increased to 100ms to ensure click doesn't immediately close it
      setTimeout(() => {
        document.addEventListener('click', this.boundClickOutside);
      }, 100);
    } else {
      this.animations.forEach((animation) => animation.cancel());

      // BUGFIX: Remove click-outside listener when dropdown closes
      document.removeEventListener('click', this.boundClickOutside);
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);
}

if (!customElements.get('header-menu')) {
class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') {
      // BUGFIX: Call parent's onToggle to enable click-outside functionality
      super.onToggle();
      return;
    }

    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );

    // BUGFIX: Call parent's onToggle to enable click-outside functionality
    super.onToggle();
  }
}

customElements.define('header-menu', HeaderMenu);
}
