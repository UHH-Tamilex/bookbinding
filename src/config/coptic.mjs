const coptic = {
    name: 'Coptic bookbinding',
    //url: 'https://staging.fdr.uni-hamburg.de/record/2368/files/coptic.db?download=1',
    url: 'https://uhh-tamilex.github.io/bookbinding/coptic.db',
    //url: 'https://staging.fdr.uni-hamburg.de/api/files/298adec3-5f3c-4a1e-9d94-5df507602c25/coptic.db',
    table: 'mss',
    columns: {
        id: 'id',
        width: 'leaf_width',
        height: 'leaf_height',
        sewingstations: 'sewing_stations',
        link: 'link'
    },
    postprocess: {
        link: str => `<a href="${str}">${str.substring(8)}</a>`,
    },
};

export default coptic;
