import { ProjectService } from '../../../services/kubernetes/project.service';
import { NavParams } from 'ionic-angular';
import { UserService } from '../../../services/user.service';
import { Component, ElementRef, Input, OnChanges } from '@angular/core';

import * as moment from 'moment';
import * as $ from 'jquery'
import Chart from 'chart.js';


@Component({
    selector: 'project-usage',
    templateUrl: 'usage.html'
})


export class ProjectUsage implements OnChanges {
    @Input() name: string;
    namespaces: any[] = [];
    disk: any;
    compute: any;
    deployment: any;
    data: any;

    constructor(
        private _userService: UserService,
        private _projectService: ProjectService,
        private _el: ElementRef,
        public navParams: NavParams
    ) { }

    ngOnChanges() {
        this.getUserProjectUsage();
        if (this.name)
            this.getProjectUsage();
    }

    getUserProjectUsage() {
        this._userService.getUserUsage().subscribe(res => {
            this.namespaces = Object.keys(res.namespaces).map(namespace => {
                return { ...res.namespaces[namespace], name: namespace }
            })
        })
    }

    createTooltipElement(tooltip) {
        const tooltipEl = $('#chartjs-tooltip');
        if (!tooltipEl[0]) {
            $('body').append('<div id="chartjs-tooltip"></div>');
            return $('#chartjs-tooltip');
        }
        if (!tooltip.opacity) {
            tooltipEl.css({
                opacity: 0
            });
            $('.chartjs-wrap canvas').each(function (index, el) {
                $(el).css('cursor', 'default');
            });
            return;
        }
        return tooltipEl;
    }

    setCaretPosition(tooltipEl, tooltip) {
        tooltipEl.removeClass('above below no-transform');
        if (tooltip.yAlign) {
            tooltipEl.addClass(tooltip.yAlign);
        } else {
            tooltipEl.addClass('no-transform');
        }
    }

    setTooltipBody(tooltipEl, tooltip) {
        if (tooltip.body) {
            const data = tooltip.afterBody;
            const title = `<strong>Date: </strong> ${tooltip.title}`
            const costToDate = `<strong>Cost to date: </strong> $${this.decimalTwoPoints(data[0].total)}`
            const innerHtml = [
                title,
                this.buildTooltipText(data[0], 'compute'),
                this.buildTooltipText(data[0], 'disk'),
                this.buildTooltipText(data[0], 'deployment'),
                costToDate
            ]
            tooltipEl.html(innerHtml.join('<br>'));
        }
    }

    setTooltipStyle(tooltipEl, tooltip) {
        const top = this.findYLocationOnPage(tooltip);
        var position = $('#chart-overview').offset();
        tooltipEl.css({
            align: 'left',
            opacity: 1,
            width: 'auto',
            left: position.left + tooltip.x - 2 + 'px',
            top: position.top + top + 'px',
            fontFamily: 'Lato',
            fontWeight: 'normal',
            padding: tooltip.yPadding + 'px ' + tooltip.xPadding + 'px',
            textAlign: 'left'
        });
    }

    findYLocationOnPage(tooltip) {
        if (!tooltip.yAlign) return 0

        const carretHeight = tooltip.caretHeight ? tooltip.caretHeight : 0
        if (tooltip.yAlign == 'above') {
            return tooltip.y - carretHeight - tooltip.caretPadding - 5;
        } else {
            return tooltip.y + carretHeight + tooltip.caretPadding - 5;
        }
    }

    customTooltip(tooltip) {
        const tooltipEl = this.createTooltipElement(tooltip);
        if (!tooltipEl) return
        this.setCaretPosition(tooltipEl, tooltip)
        this.setTooltipBody(tooltipEl, tooltip);
        this.setTooltipStyle(tooltipEl, tooltip)
    }

    initChart(datasets, allData) {
        const chartElement = this._el.nativeElement.querySelector("#chart-overview");
        Chart.defaults.global.tooltips.custom = (tooltip) => this.customTooltip(tooltip);
        new Chart(chartElement, {
            type: 'line',
            data: {
                datasets
            },
            options: {
                responsive: true,
                elements: {
                    point: { radius: 0 }
                },
                tooltips: {
                    mode: 'nearest',
                    intersect: false,
                    callbacks: {
                        afterBody: (tooltipItem, data) => {
                            return allData[tooltipItem[0].index]
                        },

                    },
                },
                hover: {
                    mode: 'nearest',
                    intersect: true,
                    animationDuration: 0
                },
                scales: {
                    yAxes: [{
                        display: true,
                        gridLines: {
                            display: false,
                            drawBorder: false,
                        },
                        scaleLabel: {
                            display: false
                        }
                    }],
                    xAxes: [{
                        type: "time",
                        time: {
                            unit: 'day',
                            tooltipFormat: 'll HH:mm',
                            displayFormats: {
                                'day': 'MMM DD'
                            }
                        },
                        display: true,
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                    }]
                },
                legend: {
                    display: false
                }
            }
        })
    }

    getProjectUsage() {
        this._projectService.getUsage(this.name).subscribe(res => {
            const usage = this.populateDataSet(res.usage);
            this.initChart(usage, res.usage)
        })
    }

    populateDataSet(usage) {
        this.disk = this.buildUsageTotalData(usage, '#1F8CEB')
        return [this.disk]
    }

    buildUsageTotalData(usage, color) {
        return {
            data: this.filterUsageTotal(usage),
            backgroundColor: 'rgba(31, 140, 235, 0.2)',
            borderColor: 'rgba(31, 140, 235, 1)',
            pointBorderWidth: 1,
            borderWidth: 1,
            pointBackgroundColor: 'rgba(255,255,255,0.2)',
            pointHoverBorderColor: 'rgba(109,209,35,0.2)',
            fill: true,
            pointHoverRadius: 1
        }
    }
    filterUsageTotal(usage) {
        return usage.map(res => {
            return { x: moment(res.created_at).format('DD MMM YYYY, HH:mm'), y: this.decimalTwoPoints(res.total) }
        })
    }

    decimalTwoPoints(decimal) {
        return (Math.ceil(decimal * 100) / 100).toFixed(2)
    }

    buildTooltipText(data, type) {
        const usedType = type == 'compute' ? 'containers' : type;
        return ` <strong>${this.getData(data, type, 'count')} ${usedType}</strong> using <strong>${this.getData(data, type, 'value')}</strong> for <strong>$${this.decimalTwoPoints(this.getData(data, type, 'total'))}</strong>`
    }

    getData(data, type, property) {
        return data[type][property]
    }
}
