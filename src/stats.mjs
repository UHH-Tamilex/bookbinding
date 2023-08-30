import Chart from 'chart.js/auto';

const getData = (dt, colx, coly, limit) => {
    const xindex = dt.column(`${colx}:name`).index();
    const yindex = dt.column(`${coly}:name`).index();
    const rows = dt.rows({search: 'applied'}).nodes().map(row => {
        const db = row.children.item(0).textContent.trim();
        const x = row.children.item(xindex).textContent;
        const y = row.children.item(yindex).textContent;
        const id = row.children.item(1).textContent;
        return {db: db, x: x, y: y, id: id}; 
    }).toArray();
    
    const sets = new Map();

    for(const row of rows) {
        const set = sets.get(row.db);
        if(set)
            set.push({ x: row.x, y: row.y, id: row.id });
        else
            sets.set(row.db,[{x: row.x, y: row.y, id: row.id}]);
    }

    const ret = [...sets].map(arr => {
        return {
            label: arr[0],
            data: arr[1]
        };
    });
    return ret;
};

const fontfam = '"Brill", "et-book", "Noto Serif Tamil", "TST Grantha", "Bangla", "PedanticDevanagari", "PedanticMalayalam", "PedanticTelugu", "Noto Sans Newa", "Satisar Sharada", "Tibetan Machine Uni", "Noto Sans Nandinagari", Palatino, "Palatino Linotype", "Palatino LT STD", "Book Antiqua", "Georgia", serif';

const chartoptions =  {
    scales: {
        x: { 
            ticks: {
                font: {family: fontfam, size: 18}, 
                precision: 0, 
                color: 'rgb(17,17,17)'
            }, 
            title: {
                display: true, 
                font: {family: fontfam, size: 18}, 
                text: 'sewing stations'
            } 
        },
        y: { 
            ticks: {
                font: {family: fontfam, size: 16}, 
                precision: 0
            }, 
            title: {
                display: true, 
                font: {family: fontfam, size: 16}, 
                text: 'leaf height'} 
            }
    },
    elements: {
        point: {
            radius: 5,
            hoverRadius: 8
        }
    },
    plugins: {
        legend: {
            labels: {
                font: {
                    family: fontfam,
                    size: 18
                },
                color: 'rgb(17,17,17)'
            }
        },
        title: {
            display: false,
            font: {
                family: fontfam,
                size: 18
            }
        },
        tooltip: {
            titleFont: { family: fontfam, size: 16 },
            bodyFont: { family: fontfam, size: 14 },
            callbacks: {
                label: context => context.raw.id
            }
        }
    }
};

const drawStats = (dt,searchparams) => {
    const statbox = document.getElementById('stats');
    statbox.innerHTML = '';
    if(searchparams && searchparams.join('').trim() !== '') {
        chartoptions.plugins.title.display = true;
        const joined = searchparams.filter(s => s.trim() !== '').join(', ');
        chartoptions.plugins.title.text = `Filter: ${joined}` ;
    }
    else
        chartoptions.plugins.title.display =  false ;

    const colx = statbox.dataset.x || 'sewingstations';
    const coly = statbox.dataset.y || 'height';
    const data = getData(dt,colx,coly,10);
    statbox.style.display = 'block';
    const canvas = document.createElement('canvas');
    statbox.appendChild(canvas);
    new Chart(
        canvas,
        {
            type: 'scatter',
            options: chartoptions,
            data: {
                datasets: data
            }
        }
    );
};

const StatsListen = (dt) => {

    document.getElementById('tabright').addEventListener('click',(e) => {

        if(document.getElementById('spinner').style.display !== 'none') return;

        if(e.target.id === 'listview' && !e.target.classList.contains('selected')) {
            e.target.classList.add('selected');
            document.getElementById('statsview').classList.remove('selected');
            document.getElementById('stats').style.display = 'none';

            document.getElementById('index_wrapper').style.display = 'block';
            //dt.columns.adjust().responsive.recalc();
            return;
        }

        if(e.target.id === 'statsview' && !e.target.classList.contains('selected')) {
            e.target.classList.add('selected');
            document.getElementById('index_wrapper').style.display = 'none';
            const listview = document.getElementById('listview').classList.remove('selected');
            const statsbox = document.getElementById('stats');
            statsbox.style.display = 'block';
            const searchparams = [dt.search(),...dt.columns().search().toArray()];
            const stringy = JSON.stringify(searchparams);
            if(!statsbox.querySelector('canvas') || statsbox.dataset.search !== stringy) {
                drawStats(dt,searchparams);
                statsbox.dataset.search = stringy;
            }
        }
});
};

export { StatsListen };
