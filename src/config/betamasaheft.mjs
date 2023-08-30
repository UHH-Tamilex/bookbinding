const betamasaheft = {
    name: 'Beta maṣāḥǝft',
    url: '/betamasaheft.db',
    table: 'mss',
    columns: {
        id: 'id',
        width: 'outer_width',
        height: 'outer_height',
        sewingstations: 'sewing_stations',
        link: 'link'
    },
    postprocess: {
        link: str => `<a href="${str}">${str.substring(8)}</a>`,
    },
};

export default betamasaheft;
