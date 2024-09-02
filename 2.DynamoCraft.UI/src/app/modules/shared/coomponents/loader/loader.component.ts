import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnChanges {
    @Input() isLoading: boolean = false;
    showLoader: boolean = false;
    private delayTimeout: any;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isLoading']) {
            if (this.isLoading) {
                this.showLoader = true;
                this.hideLoaderAfterDelay();
            } else {
                this.hideLoader();
            }
        }
    }

    private hideLoaderAfterDelay(): void {
        clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.showLoader = false;
        }, 3000); // 3 secondes avant de masquer le loader
    }

    private hideLoader(): void {
        clearTimeout(this.delayTimeout);
        this.showLoader = false;
    }
}
