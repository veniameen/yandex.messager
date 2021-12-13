export const page = {
    render: (html: string | HTMLElement, data: Object): void => {
        const app = document.querySelector('.app');
    
        if ( app ) {
          app.innerHTML = Handlebars.compile(html)(data);
        }
    }
}