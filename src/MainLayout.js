import React, { Component } from 'react';

import { Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Button, TextField, Stack } from '@mui/material';

let apiCalls = require('./service/APICalls');

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newItemDescription: '',
            tableData: null 
        };  
    } 

    componentDidMount() {
        this.getItems();
    }

    getItems() {
        apiCalls.getItems((data, error) => {
            if (data === null)
                return;
            
            if (data['items'].length <= 0) 
                this.setState({ tableData: null });

            let columns = this.setColumns();

            let rows = [];
            let index = 0;
            data['items'].forEach(item => {
                rows.push({
                    index: index,
                    id: item['id'],
                    description: item['description'],
                    timeStamp: (new Date(item['lastUpdate'])).toString()
                });
                index++;
            });

            this.setState({
                tableData: {
                    columns: columns,
                    rows: rows
                }
            })
        });
    }

    setColumns() {
        return(
            [
                {
                    id: 'description',
                    label: 'Description'
                },
                {
                    id: 'timeStamp',
                    label: 'Create / Update Time'
                },
                {
                    id: 'update',
                    label: 'Update Item'
                },
                {
                    id: 'delete',
                    label: 'Delete Item'
                }
            ]
        );
    }

    addItem() {
        if (this.state.newItemDescription.length <= 0)
            return;

        const requestInfo = { description: this.state.newItemDescription };
        this.setState({ newItemDescription: '' })
        
        apiCalls.addItem(requestInfo, (data, error) => {
            if (data['id'] === 200)
                this.getItems();
        });

    }

    updateItem(itemId, description) {
        console.log('update item');
        console.log(itemId);
        console.log(description);
        const requestInfo = { description: description };
        apiCalls.updateItem(requestInfo, itemId, (data, error) => {
            if (data['id'] === 200)
                this.getItems();
        });
    }

    itemButtonClicked(itemId, columnId, rowIndex) {
        if (columnId === 'delete') {
            apiCalls.deleteItem(itemId, (data, error) => {
                if (data != null && data['id'] === 200) 
                    this.getItems();
            });
        }

        if (columnId === 'update') {
            const requestInfo = { description: this.state.tableData.rows[rowIndex]['description'] }; 
            apiCalls.updateItem(requestInfo, itemId, (data, error) => {
                if (data['id'] === 200)
                    this.getItems();
            });
        }
        
    }

    newDescriptionChange(description) {
        this.setState({ newItemDescription: description })
    }

    descriptionUpdateChange(description, rowIndex) {
        let rowsTemp = this.state.tableData.rows;
        const columnsTemp = this.state.tableData.columns;
        rowsTemp[rowIndex]['description'] = description;
        this.setState({ 
            tableData: {
                columns: columnsTemp,
                rows: rowsTemp
            } 
        })

    }

    render() {
        return (
            <div>
                { this.getAddItemStack() }
                { this.getTable() }
            </div>
        );
    }

    getAddItemStack() {
        return (
            <Stack direction="row" spacing={2} sx={{ mt: 1, ml: 1, mr: 1 }}>
                <TextField
                    id="standard-basic"
                    label="Description for new item"
                    variant="standard"
                    size="small"
                    style={{ width: 300 }}
                    value={ this.state.newItemDescription }
                    onChange={(e) => this.newDescriptionChange(e.target.value)}
                />
                <Button
                    variant="outlined"
                    onClick={() => this.addItem()}
                    style={{ height: 44 }}
                >ADD TO LIST
                </Button>
            </Stack>
        );
    }

    getTable() {
        if (this.state.tableData == null) {
            return(<h3>Your todo list is empty</h3>);
        } else {
            return (
                <div>
                    <TableContainer>
                        <Table stickyHeader aria-label="sticky table" >
                            <TableHead>
                                <TableRow key='header-row'>
                                    {this.state.tableData.columns.map(header => {
                                        return (
                                            <TableCell key={header.id} align='center' style={{ fontWeight: 'bold' }} >
                                                {header.label}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.tableData.rows.map(row => {
                                    return (this.getRowInfo(this.state.tableData.columns, row));
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            );
        }
    }

    getRowInfo(headers, row) {
        return (
            <TableRow
                id={row.id}
                hover role="checkbox"
                tabIndex={-1}
                key={row.id}
                >
                {headers.map(column => {
                    
                    const value = row[column.id];

                    if (column.id === 'description') 
                        return this.createTextField(row.id, column.id, row.index);
                    
                    if (column.id === 'timeStamp')
                        return (
                            <TableCell key={column.id} align='center'>
                                {value}
                            </TableCell>
                        );
                    
                    return this.createButton(row.id, column.id, row.index);

                })}
            </TableRow>);
    }

    createTextField(itemId, columnId, rowIndex) {
        return (
            <TableCell key={columnId} align='center'>
                {<TextField
                    id={'field-id' + itemId}
                    variant='standard'
                    size="small"
                    style={{ width: 300 }}
                    value={this.state.tableData.rows[rowIndex]['description']}
                    // value={value}
                    onChange={(e) => this.descriptionUpdateChange(e.target.value, rowIndex)}
                />}
            </TableCell>
        );
    }

    createButton(itemId, columnId, rowIndex) {
        return (
            <TableCell key={columnId} align='center'>
                <Button
                    id={columnId}
                    variant='text'
                    onClick={() => this.itemButtonClicked(itemId, columnId, rowIndex)}
                >{columnId}
                </Button>
            </TableCell>
        );
    }

}

export default Container;

     