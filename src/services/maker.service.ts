import { Maker } from "../models/maker";
import * as moment from 'moment';
import conf from '../confs';
import { OfficeSlot } from "../models/hebdo-slot";

class MakerService{

     /**
     * 15 minutes en ms
     */
    private static SLOT_QTY = 900000;

    public weekDateToDate(year:number, week:number, day:number) {
        const firstDayOfYear = new Date(year, 0, 1)
        const days = 2 + day + (week - 1) * 7 - firstDayOfYear.getDay()
        return new Date(year, 0, days);
      }

    /**
     * Les 1ers créneaux disponibles. Sur 7 jours glissant. 
     * 
     * @param maker 
     */
    public getSlots(maker : Maker, limit = -1): Date[]{
        const results : Date[] = [];
        let now = moment.default();

        // /!\ rdv après X jours min
        now.add((maker as any).startDriveAfterDays || conf.defaultStartDriveAfterDays, 'd');
        //now.hours(6).minutes(0).seconds(0);

        // skip weekCloses
        let currentWeekNumber = now.week();
        // tant que la semaine est fermée, on passe la suivante
        while(maker.weekCloses && (maker.weekCloses.indexOf(currentWeekNumber) > -1)){
            currentWeekNumber = currentWeekNumber + 1;
        }
        const firstDayOfOpenedWeek = this.weekDateToDate(now.year(), currentWeekNumber, 0);
        if(firstDayOfOpenedWeek.getTime() >= now.toDate().getTime()){
            now = moment.default(firstDayOfOpenedWeek)
        }
        
        // on propose au maximum, les 7 jours clissants
        for(let i = 0; i< 7; i++){
            // si férié, on passe
            if(conf.publicHolidays.some(ph => ph.date === now.format('YYYY-MM-DD'))){
                now.add(1, 'd');
                continue;
            }
            
            let currentWeekNumber = now.week();
            if(maker.weekCloses && (maker.weekCloses.indexOf(currentWeekNumber) > -1)) {
                now.add(1, 'd');
                continue;
            }

            let nowDate = now.toDate();
            const dayKey = now.format('dddd').toLowerCase();
            const slots : any = maker.place.hebdoSlot;
            const officeSlot: OfficeSlot = slots[dayKey];
            if(!officeSlot || !officeSlot.openAt || !officeSlot.closeAt){
                now.add(1, 'd');
                continue;
            }

            nowDate.setHours(parseInt(officeSlot.openAt.split(':')[0],10));
            nowDate.setMinutes(parseInt(officeSlot.openAt.split(':')[1],10));
            nowDate.setSeconds(0);
            nowDate.setMilliseconds(0);
            
            const closeAt = new Date(nowDate);
            closeAt.setHours(parseInt(officeSlot.closeAt.split(':')[0],10));
            closeAt.setMinutes(parseInt(officeSlot.closeAt.split(':')[1],10));
            closeAt.setSeconds(59);

            if(closeAt.getTime() <= nowDate.getTime()){
                // la date d'ouverture est plus récente que la date de fermeture: ERREUR
                now.add(1, 'd');
                continue;
            }

            //on parcours tous les créneaux pour le jour "ouvert"
            const slotsQty = parseInt(`${(closeAt.getTime() - nowDate.getTime())/MakerService.SLOT_QTY}`,10)+1;
            for(let j =0; j<slotsQty;j++){
                nowDate = new Date(nowDate.getTime() + ((j > 0) ? MakerService.SLOT_QTY:0));
                results.push(new Date(nowDate));
            }

            now.add(1, 'd');

            if((limit > 0) && (i >=limit)){
                break;
            }
        }
        
        return results;
    }
}

export default new MakerService();