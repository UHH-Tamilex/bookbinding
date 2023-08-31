import createSqlWorker from './sqlWorker.mjs';
import { StatsListen} from './stats.mjs';
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';

import tst from './config/tst.mjs';
import coptic from './config/coptic.mjs';
import betamasaheft from './config/betamasaheft.mjs';


const allColumns = new Map([
    ['id', {data: 'id', title: 'ID', name: 'id'}],
    ['width',{data: 'width', title: 'leaf width (mm)', name: 'width'}],
    ['height',{data: 'height', title: 'leaf height (mm)', name: 'height'}],
    ['sewingstations',{data: 'sewingstations',title: 'sewing stations', name: 'sewingstations'}],
    ['link',{data: 'link',title: 'source',name: 'link'}]
    ]);

const getData = async (config) => {
    const worker = await createSqlWorker(config.url);

    const conditions = config.conditions ? ` WHERE ${config.conditions.join(' AND ')}` : '';
    const columnstr = [...allColumns.keys()].map(str => `${config.columns[str]} AS ${str}`).join(', ');
    const result = await worker.db.query(`SELECT ${columnstr} FROM ${config.table}${conditions}`);
    for(const row of result) {
        row.database = config.name;
        if(config.postprocess) {
            for(const column of [...allColumns.keys()]) {
                if(config.postprocess[column])
                    row[column] = config.postprocess[column](row[column]);
            }
        }
    }
    return result;
};

const filterColumn = (dt,e) => {
    const colname = e.target.dataset.name;
    if(!colname) return;

    const column = dt.column(`${colname}:name`);
    if(column.search() !== e.target.value)
        column.search(e.target.value).draw();
};

const makeTable = (data,table) => {
    const columns = [...allColumns.values()];
    columns.unshift({data: 'database', title: 'database', name: 'database'});
    const dataTable = new DataTable(`#${table.id}`, {
          searchable: true,
          'language': {
              'search': 'Filter: '
          },
          order: [4,'asc'],
          paging: true,
          pageLength: 100,
          lengthMenu: [
            [25, 50, 100, -1],
            [25, 50, 100, 'All']
          ],
          sortable: true,
          data: data,
          columns: columns,
          responsive: {
              details: {
                  type: 'inline'
              }
          },
          //scrollX: true
          //fixedHeader: true

  });
  const filterrow = document.createElement('tr');
  filterrow.id = 'filter_inputs';
  for(const column of columns) {
    const th = document.createElement('th');
    const input = document.createElement('input');
    input.type = 'text';
    input.dataset.name = column.name;
    input.placeholder = `Filter ${column.title}`;
    input.style.width = '100%';
    th.appendChild(input);
    filterrow.appendChild(th);
  }
  filterrow.style.height = '0px';
  document.querySelector('thead').prepend(filterrow);
  filterrow.addEventListener('keyup', filterColumn.bind(null,dataTable));
  filterrow.addEventListener('change', filterColumn.bind(null,dataTable));
  filterrow.addEventListener('clear', filterColumn.bind(null,dataTable));
   /* 
  const filterbutton = document.createElement('button');
  filterbutton.id = 'filter_button';
  filterbutton.title = 'More filters';
  filterbutton.append('+');
  document.getElementById('index_filter').appendChild(filterbutton);
  filterbutton.addEventListener('click', (e) => {
    const toshow = document.getElementById('filter_inputs');
    if(toshow.style.height === '0px') {
        toshow.style.height = 'auto';
        const inputs = [...toshow.querySelectorAll('th')];
        const ths = toshow.nextElementSibling.querySelectorAll('th');
        for(let n=0;n<inputs.length;n++) {
            if(ths.item(n).style.display !== 'none') {
                const input = inputs[n];
                input.style.display = 'table-cell';
                input.style.marginBottom = '1rem';
                input.style.marginTop = '1rem';
            }
        }
        e.target.textContent = '–';
        e.target.title = 'Less filters';
    }
    else {
        toshow.style.height = '0px';
        for(const input of toshow.querySelectorAll('th')) {
            input.style.display = 'none';
            input.style.marginBottom = '0px';
            input.style.marginTop = '0px';
        }
        e.target.textContent = '+';
        e.target.title = 'More filters';
    }
  });
    */
  document.getElementById('spinner').style.display = 'none';
  const tabs = document.getElementById('tabright');
  if(tabs) tabs.style.visibility = 'visible';
  document.getElementById('index').style.visibility = 'visible';
  //dataTable.columns.adjust().responsive.recalc();

  dataTable.on('responsive-resize', () => {

    const toshow = document.getElementById('filter_inputs');
    if(toshow.style.height === '0px') return;

    const inputs = [...toshow.querySelectorAll('th')];
    const ths = toshow.nextElementSibling.querySelectorAll('th');
    for(let n=0;n<inputs.length;n++) {
        const input = inputs[n];
        if(ths.item(n).style.display !== 'none') {
            input.style.display = 'table-cell';
            input.style.marginBottom = '1rem';
            input.style.marginTop = '1rem';
        }
        else {
            input.style.display = 'none';
            input.style.marginBottom = '0px';
            input.style.marginTop = '0px';
        }
    }
  });

  //table.dataset.files = data.files;

  return dataTable;
};
window.addEventListener('load', async () => {
    const results = [
        ...await getData(tst), 
        ...await getData(coptic), 
        ...await getData(betamasaheft)
    ];
    
    const dt = makeTable(results,document.querySelector('table'));
    StatsListen(dt);
});
