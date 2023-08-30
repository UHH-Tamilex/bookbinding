const tst = {
    name: 'TST',
    url: 'https://tst-project.github.io/mss/db/meta.db',
    table: 'mss',
    columns: {
        id: 'shelfmark',
        sewingstations: 'stringholes',
        width: 'width',
        height: 'height',
        link: 'filename'
    },
    postprocess: {
        link: str => `<a href="https://tst.cnrs.fr/mss/${str}">tst.cnrs.fr/mss/${str}</a>`,
    },
    conditions: ["stringholes != ''","form = 'codex'"]
};

export default tst;
