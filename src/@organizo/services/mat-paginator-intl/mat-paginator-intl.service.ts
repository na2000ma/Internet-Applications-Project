import {TranslateService} from '@ngx-translate/core';
import {MatPaginatorIntl} from "@angular/material/paginator";
import {Subject, takeUntil} from "rxjs";
import {Injectable, OnDestroy} from "@angular/core";

@Injectable()
export class MatPaginatorIntlService extends MatPaginatorIntl implements OnDestroy {

  private unsubscribe: Subject<void> = new Subject<void>();
  private translatedRangeLabel: string = '';

  constructor(private translateService: TranslateService) {
    super();
    this.translateService.onLangChange.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(() => {
      this.getAndInitTranslations();
    });
    this.getAndInitTranslations();
  }

  getAndInitTranslations() {
    this.translateService.stream([
      'matPaginator.ITEMS_PER_PAGE_LABEL',
      'matPaginator.NEXT_PAGE_LABEL',
      'matPaginator.PREVIOUS_PAGE_LABEL',
      'matPaginator.FIRST_PAGE_LABEL',
      'matPaginator.LAST_PAGE_LABEL',
      'matPaginator.RANGE_PAGE_LABEL_1',
      'matPaginator.RANGE_PAGE_LABEL_2'
    ]).pipe(takeUntil(this.unsubscribe))
      .subscribe(translation => {
        this.itemsPerPageLabel = translation['matPaginator.ITEMS_PER_PAGE_LABEL'];
        this.nextPageLabel = translation['matPaginator.NEXT_PAGE_LABEL'];
        this.previousPageLabel = translation['matPaginator.PREVIOUS_PAGE_LABEL'];
        this.firstPageLabel = translation['matPaginator.FIRST_PAGE_LABEL'];
        this.lastPageLabel = translation['matPaginator.LAST_PAGE_LABEL'];
        this.translatedRangeLabel = this.getRangeLabel.bind(this);
        this.changes.next();
      });
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return this.translateService.instant('matPaginator.RANGE_PAGE_LABEL_1', {length});
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translateService.instant('matPaginator.RANGE_PAGE_LABEL_2', {
      startIndex: startIndex + 1,
      endIndex,
      length
    });
  };

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
