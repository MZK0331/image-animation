export const textFadeInAnimationHandler = () => {
    const textFadeInWraps = document.querySelectorAll<HTMLElement>('.text-fade-in');
    textFadeInWraps.forEach((wrap) => {
        wrap.innerHTML = wrap.innerText.replace(/\S/g, '<span class="fade-in-char">$&</span>');
    });
}