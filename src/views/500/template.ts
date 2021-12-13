export default `
    <div class="grid grid-column page-error">
        <h1 class="page-error__code">{{status}}</h1>
        <h2 class="page-error__heading">{{caption}}</h2>
        <div class="page-error__backlink"><a class="link" href={{backlink.href}}>{{backlink.text}}</a></div>
    </div>
`;