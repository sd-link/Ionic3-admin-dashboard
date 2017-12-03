import { NgModule } from '@angular/core';
import { RoundPipe } from './round/round'

@NgModule({
    imports: [],
    declarations: [RoundPipe],
    exports: [RoundPipe],
})

export class PipeModule {

    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
} 