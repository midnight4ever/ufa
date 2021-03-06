import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import {withSnackbar} from 'notistack'

const axios = require('axios')
const style = {
    margin: '10px',
}

function DepartmentTable(props) {
    const [state, setState] = React.useState({
        columns: [  
            { title: 'Tên đơn vị', field: 'name' },
            { title: 'Loại đơn vị', field: 'type', lookup: {1: 'Bộ môn', 2: 'Phòng thí nghiệm'}},
            { title: 'Địa chỉ', field: 'address'},
            { title: 'Điện thoại', field: 'phone'},
            { title: 'Website', field: 'website'}
        ],
        data: [],
    });

    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        setLoading(true)
        let data = []
        axios.get('http://localhost:9000/departments')
            .then(res => {
                res.data.forEach(item => {
                    let {_id, ...rest} = item
                    let id = _id
                    data.push({id, ...rest})
                    setState({...state, data})
                    setLoading(false)
                })
            })
            .catch(e => {console.log(e)})
    }, [])

    const addDataToDb = (newdata) => {
        axios.post('http://localhost:9000/departments', {...newdata})
            .then(res => {
                // console.log(res)
                let {_id, ...rest} = res.data
                let id = _id.toString()
                let newObj = {id, ...rest}
                const data = [...state.data]
                data.push(newObj)
                setState({...state, data})
                props.enqueueSnackbar('Ok', {variant: 'success', action})

            })
            .catch(e => {
                console.log(e)
            })
    }

    const editDataToDb = (newData) => {
        let {id, ...rest} = newData
        axios.patch(`http://localhost:9000/departments/${id}`, {id, ...rest})
            .then(res => {
                // console.log(res)
                props.enqueueSnackbar('Ok', {variant: 'success', action})
            })
            .catch(e => {
                console.log(e)
            })
    }

    const deleteData = (data) => {
        let {id} = data
        axios.delete(`http://localhost:9000/departments/${id}`, id)
            .then(res => {
                // console.log(res)
                props.enqueueSnackbar('Ok', {variant: 'success', action})
            })
            .catch(e => {
                console.log(e)
            })
    } 

    const action = (key) => (
        <Button onClick={() => { props.closeSnackbar(key) }}>
            {'Dismiss'}
        </Button>
    )

    return (
    <div style={style}>
        <MaterialTable
            title="Quản lý đơn vị"
            isLoading= {loading}
            columns={state.columns}
            data={state.data}
            options={{
                grouping: true,
                // selection: true
                headerStyle: {
                backgroundColor: '#005e94',
                color: '#FFF',
                fontSize: '15px'
                }
            }}
            editable={{
                onRowAdd: newData =>
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            addDataToDb(newData)
                        }, 500);
                    }),

                onRowUpdate: (newData, oldData) =>
                    new Promise(resolve => {
                        setTimeout(() => {
                            resolve();
                            const data = [...state.data];
                            data[data.indexOf(oldData)] = newData;
                            setState({ ...state, data });
                            editDataToDb(newData)
                        }, 500);
                    }),

                onRowDelete: oldData =>
                    new Promise(resolve => {
                        // console.log(oldData)
                        setTimeout(() => {
                            resolve();
                            const data = [...state.data];
                            data.splice(data.indexOf(oldData), 1);
                            setState({ ...state, data });
                            deleteData(oldData)
                        }, 500);
                    }),
            }}
            
        />
    </div>
    )
}

export default withSnackbar(DepartmentTable)