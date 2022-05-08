export default `
    <button class="btn {{#each this.classList}} {{this}}{{/each}}" type={{type}}>
        {{caption}}
    </button>
`;
