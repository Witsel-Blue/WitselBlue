import p5 from 'p5';

export default (ctx, inject) => {
    window.p5 = p5;
    inject('p5', p5);
}