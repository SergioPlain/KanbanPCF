/* eslint-disable no-unused-vars */
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import {KanbanComponent, IColumn, IRecord, IDroppable} from './components/KanbanComponent'
import * as React from "react";

interface IStatus {
    label: string
    value: number
}

type ConditionExpression = ComponentFramework.PropertyHelper.DataSetApi.ConditionExpression;
type DataSet = ComponentFramework.PropertyTypes.DataSet;


export class KanbanBoard implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private _notifyOutputChanged: () => void;
    private _context: ComponentFramework.Context<IInputs>;
    private _records: ComponentFramework.PropertyTypes.DataSet;
    private _column: IColumn;
    private _record: IRecord;
    private _droppable : IDroppable = {};
    private _options: IStatus[] = [];
    private _datasetColumns: ComponentFramework.PropertyHelper.DataSetApi.Column[] = [];

    private Filter(name: string, value:string):void{
        const filtering = this._context.parameters.records.filtering;
        filtering.clearFilter();
        filtering.setFilter({
            conditions: [
                {
                    attributeName: name,
                    conditionOperator: 0, //Equals
                    value: "%" + value + "%",
                },
            ],
        } as ComponentFramework.PropertyHelper.DataSetApi.FilterExpression
        );
        this._context.parameters.records.refresh();
    }
    

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this._notifyOutputChanged = notifyOutputChanged;
        this._records = context.parameters.records;
        this._datasetColumns = this._records.columns;

        (context.parameters.status as ComponentFramework.PropertyTypes.OptionSetProperty).attributes?.Options.forEach(option => {
            const status = {
                label: option.Label,
                value: option.Value
            };
            this._options.push(status)
        })
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {

        this._options.map((option) => {
            const label = option.label;
            this.Filter("statuscode",option.label)
            const object:IColumn = {
                    name: option.label,
                    items: []
            }
            this._droppable.label = object

        })
        
        return React.createElement(
            KanbanComponent, this._droppable
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
