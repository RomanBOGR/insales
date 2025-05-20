
// $(function(){
//   const linkYoutube = "https://www.youtube.com/watch?feature=shared&v=lTy3DjYCJJU"
//   const linkTrigger = "https://alilo.ru/?utm_source=abumba&utm_medium=f1&utm_campaign=box"
//   const currentUrl = window.location.href;
//   if ( currentUrl === linkTrigger ) {
//     window.location.href = linkYoutube;
//   }
// });

console.log('work')
if (window.location.search === '?utm_source=abumba_box&utm_medium=f1&utm_campaign=box') {
  window.location.href = "https://youtu.be/lTy3DjYCJJU?feature=shared";

}