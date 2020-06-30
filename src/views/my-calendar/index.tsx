import React from 'react';
import MenuApp from '../../components/menu-app';
import Typography from '@material-ui/core/Typography';
import './MyCalendar.scss';
import Calendar from 'react-calendar'


const myMaxDate = new Date();
myMaxDate.setFullYear( myMaxDate.getFullYear() + 1);

class MyCalendar extends React.Component<{ history: any, location: any }, { maxDate:Date, minDate:Date, close:number[] }> {

    state ={minDate: new Date(), maxDate: myMaxDate, close:[]};

    tileClassName( date:any, view:any ){
        const week : number = date.getWeek();
        return view === 'month' && this.state.close.findIndex(c => c === week) > -1 ? 'wc':'';
    }

    onClickDay(date:any){
        console.log(date);
        const week : any = date.getWeek();
        const i = this.state.close.findIndex(c => c === week);
        if(i > -1)
            (this.state.close as number[]).push(week);
        else{
            const newClose = this.state.close.concat([]);
            newClose.splice(i,1);
            this.setState({close:newClose});
        }
    }

    render() {
        return (<div className="my-calendar">
            <MenuApp mode="light" history={this.props.history} />

            <Typography className="my-title" variant="h5">
  Fermetures du Drive
</Typography>

            <Calendar 
                className="my-element" 
                defaultView="month" 
                maxDate={this.state.maxDate} 
                minDate={this.state.minDate} 
                onClickDay={(value:any) => this.onClickDay(value)}
                tileClassName={(props:any) => this.tileClassName(props.date, props.view)}
                locale="fr-FR"
            ></Calendar>
        </div>)
    }
}


export default MyCalendar;