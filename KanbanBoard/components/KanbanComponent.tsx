/* eslint-disable no-unused-vars */
import {useState} from 'react';
import * as React from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

export interface IDroppable {
    [key:string]: IColumn
}

export interface IRecord {
    id: string,
    content: string
}

export interface IColumn {
    name: string,
    items: IRecord[]
}

const itemsFromBackend:IRecord[] = [
    {id: "1", content:"First task"},
    {id: "2", content:"Second task"},
    {id: "3", content:"Third task"},
    {id: "4", content:"Fourth task"}
];

const columnsFromBacked:IDroppable = {
    ["1"]:{
        name: "Requested",
        items: itemsFromBackend
    },
    ["2"]:{
        name: "To Do",
        items: []
    },
    ["3"]:{
        name: "In Progress",
        items: []
    },
    ["4"]:{
        name: "Done",
        items: []
    },
};

const OnDragEnd = (result:any, columns:any, setColumns:any) => {
    if(!result.destination) return;
    const {source, destination} = result;
    console.log(source);
    console.log(destination);
    if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setColumns({
            ...columns,
            [source.droppableId]:{
                ...sourceColumn,
                items: sourceItems
            },
            [destination.droppableId]:{
                ...destColumn,
                items: destItems
            }
        })
    } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items]
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index,0,removed);
        columns[source.droppableId].items = copiedItems
        setColumns({
            ...columns,
            [source.droppableId]:{
                ...column,
                items: copiedItems
            }
        })
    }
}

export const KanbanComponent = (props:IDroppable) => {
    const [columns, setColumns] = useState(props);

    return (
        <div className='main-container'>
        <DragDropContext onDragEnd={(result) => OnDragEnd(result,columns,setColumns) 
        }>
            {Object.entries(columns).map(([id,column]) => (

                <div className='board-container' key={id}>
                    <h2>{column.name}</h2>
                    <div className='droppable-container'>
                    <Droppable droppableId={id} >
                    {(droppableProvided, snapshot) =>(
                        <ul 
                            {...droppableProvided.droppableProps}
                            ref={droppableProvided.innerRef}
                            className='task-container'
                            style={{
                                background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                            }}
                        >
                            {column.items.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(draggableProvided, snapshot) => (
                                    <li 
                                        {...draggableProvided.draggableProps}
                                        ref={draggableProvided.innerRef}
                                        {...draggableProvided.dragHandleProps}
                                        className='task-item' 
                                        style={{
                                            backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                            ...draggableProvided.draggableProps.style
                                        }}
                                        >
                                        {item.content}
                                    </li>
                                    )}
                                </Draggable>
                            ))}
                            {droppableProvided.placeholder}
                        </ul>
                    )}
                    </Droppable>
                    </div>
                </div>
                )
            )}                
        </DragDropContext>
        </div>
    )
} 