import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class FormatterService {

    constructor() { }

    getInitial(word: String) {
        return word
            .split(' ')
            .filter(res => !!res)
            .slice(0, 2)
            .map(name => name[0].toUpperCase())
            .join('');
    }

    // Convert from Zulu ISO8601
    getFormatedDate(date: any) {
        return moment(date, 'YYYY-MM-DDTHH:mm:ss\\Z').format('DD MMM, YYYY');
    }

    getUnixToDate(date: any) {
        return moment(date, 'x').format('DD MMM YYYY hh:mm a');
    }

    parseByteCount(bytes, force_iec = true) {
        const matches = bytes.toString().toLowerCase().match('([0-9.]+)[ ]*([a-z]*)');
        let quantity = matches[1];
        const unit = matches[2];
        const unit_length = unit.length;
        let base = 0;
        if (unit_length > 0) {
            // Determine if the unit is SI or IEC. The second letter of an abbreviated
            // IEC unit is always 'i', for example MiB. The forth letter of an
            // unabbreviated IEC unit is always 'i', for example mebibyte.
            const short_iec = unit_length == 3 && unit[1] == 'i';
            const long_iec = unit_length >= 4 && unit[3] == 'i';
            if (short_iec || long_iec || force_iec) {
                base = 1024;
            } else {
                base = 1000;
            }
            // Multiply the quantity by the quantity of the unit. The quantity of the
            // unit is calculated by determining its order of magnitude and raising the
            // base of the unit to this power.
            quantity = quantity * Math.pow(base, 'bkmgtpezy'.indexOf(unit[0]));
        }
        // Make sure an integer is returned. Not cast to an integer type as this would
        // limit the maximum to 2 GiB on 32-bit platforms.
        return Math.floor(quantity);
    }

    formatBytes(bytes, force_iec = true) {
        var thresh = force_iec ? 1024 : 1000;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = force_iec
            ? ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
            : ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    }

    formatBytesToMib(bytes,force_iec=true){
        var thresh = force_iec ? 1024 : 1000;
        bytes=bytes/thresh/thresh;
        return bytes;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
