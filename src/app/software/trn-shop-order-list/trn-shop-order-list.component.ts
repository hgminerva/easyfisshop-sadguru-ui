import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { TrnShopOrderListService } from './trn-shop-order-list.service'

import { ToastrService } from 'ngx-toastr';

import { SoftwareUserFormService } from '../software-user-form.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trn-shop-order-list',
  templateUrl: './trn-shop-order-list.component.html',
  styleUrls: ['./trn-shop-order-list.component.css']
})
export class TrnShopOrderListComponent implements OnInit {
  constructor(
    private trnShopOrderListService: TrnShopOrderListService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private softwareUserFormService: SoftwareUserFormService,
    private router: Router
  ) { }

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();
  public shopOrderStartDateFilterData = new Date();
  public shopOrderEndDateFilterData = new Date();

  public cboShopGroupSubscription: any;
  public cboShopGroupObservableArray: ObservableArray = new ObservableArray();
  @ViewChild('cboShopGroup') cboShopGroup: WjComboBox;

  public cboShopOrderStatusSubscription: any;
  public cboShopOrderStatusObservableArray: ObservableArray = new ObservableArray();
  @ViewChild('cboShopOrderStatus') cboShopOrderStatus: WjComboBox;

  public isDataLoaded: boolean = false;
  public listShopOrderSubscription: any;
  public listShopOrderObservableArray: ObservableArray = new ObservableArray();
  public listShopOrderCollectionView: CollectionView = new CollectionView(this.listShopOrderObservableArray);
  public listShopPageIndex: number = 15;
  @ViewChild('listShopOrderFlexGrid') listShopOrderFlexGrid: WjFlexGrid;

  public importShopOrderSubscription: any;
  public addShopOrderSubscription: any;
  public deleteShopOrderSubscription: any;
  public shopOrderDeleteModalRef: BsModalRef;

  public getUserFormsSubscription: any;
  public isLoadingSpinnerHidden: boolean = false;
  public isContentHidden: boolean = true;

  public isAddButtonHide: boolean = true;
  public isEditButtonHide: boolean = true;
  public isDeleteButtonHide: boolean = true;

  public isShowEditColumn: boolean = false;
  public isShowDeleteColumn: boolean = false;

  public isProgressBarHidden = false;

  public shopOrderImportModalRef: BsModalRef;
  public shopOrderConfirmApplyModalRef: BsModalRef;

  public importedCSVObservableArray: ObservableArray = new ObservableArray();
  public importedCSVCollectionView: CollectionView = new CollectionView(this.importedCSVObservableArray);
  public isLoadingImportCSVSpinnerHidden: boolean = true;

  // Combo box for number of rows
  public createCboShowNumberOfRows(): void {
    for (var i = 0; i <= 4; i++) {
      var rows = 0;
      var rowsString = "";

      if (i == 0) {
        rows = 15;
        rowsString = "Show 15";
      } else if (i == 1) {
        rows = 50;
        rowsString = "Show 50";
      } else if (i == 2) {
        rows = 100;
        rowsString = "Show 100";
      } else if (i == 3) {
        rows = 150;
        rowsString = "Show 150";
      } else {
        rows = 200;
        rowsString = "Show 200";
      }

      this.cboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public cboShowNumberOfRowsOnSelectedIndexChanged(selectedValue: any): void {
    this.listShopPageIndex = selectedValue;

    this.listShopOrderCollectionView.pageSize = this.listShopPageIndex;
    this.listShopOrderCollectionView.refresh();
    this.listShopOrderCollectionView.refresh();
  }

  // Start date text changed event
  public startDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listShopOrder();
      }, 100);
    }
  }

  // End date text changed event
  public endDateTextChanged(): void {
    if (this.isDataLoaded) {
      setTimeout(() => {
        this.listShopOrder();
      }, 100);
    }
  }

  // Create combo box shop group
  public createCboShopGroup(): void {
    this.trnShopOrderListService.listShopGroup();
    this.cboShopGroupSubscription = this.trnShopOrderListService.listShopGroupObservable.subscribe(
      data => {
        let shopGroupObservableArray = new ObservableArray();

        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            shopGroupObservableArray.push({
              Id: data[i].Id,
              ShopGroupCode: data[i].ShopGroupCode,
              ShopGroup: data[i].ShopGroup
            });
          }
        }

        this.cboShopGroupObservableArray = shopGroupObservableArray;
        if (this.cboShopGroupObservableArray.length > 0) {
          this.createCboShopOrderStatus();
        }

        if (this.cboShopGroupSubscription != null) this.cboShopGroupSubscription.unsubscribe();
      }
    );
  }

  // Combo box shop group selected index changed
  public cboShopGroupSelectedIndexChanged(): void {
    if (this.isDataLoaded) {
      if (this.cboShopGroup.selectedValue != null) {
        setTimeout(() => {
          this.listShopOrder();
        }, 100);
      }
    }
  }

  // Create combo box shop order status
  public createCboShopOrderStatus(): void {
    this.trnShopOrderListService.listShopOrderStatus();
    this.cboShopOrderStatusSubscription = this.trnShopOrderListService.listShopOrderStatusObservable.subscribe(
      data => {
        let shopOrderStatusObservableArray = new ObservableArray();

        if (data != null) {
          for (var i = 0; i <= data.length - 1; i++) {
            shopOrderStatusObservableArray.push({
              Id: data[i].Id,
              ShopOrderStatusCode: data[i].ShopOrderStatusCode,
              ShopOrderStatus: data[i].ShopOrderStatus
            });
          }
        }

        this.cboShopOrderStatusObservableArray = shopOrderStatusObservableArray;
        if (this.cboShopOrderStatusObservableArray.length > 0) {
          setTimeout(() => {
            this.listShopOrder();
          }, 100);
        }

        if (this.cboShopOrderStatusSubscription != null) this.cboShopOrderStatusSubscription.unsubscribe();
      }
    );
  }

  // Combo box shop order status selected index changed
  public cboShopOrderStatusSelectedIndexChanged(): void {
    if (this.isDataLoaded) {
      if (this.cboShopOrderStatus.selectedValue != null) {
        setTimeout(() => {
          this.listShopOrder();
        }, 100);
      }
    }
  }

  // List shop order
  public listShopOrder(): void {
    this.listShopOrderObservableArray = new ObservableArray();
    this.listShopOrderCollectionView = new CollectionView(this.listShopOrderObservableArray);
    this.listShopOrderCollectionView.pageSize = 15;
    this.listShopOrderCollectionView.trackChanges = true;
    this.listShopOrderCollectionView.refresh();
    this.listShopOrderFlexGrid.refresh();

    let startDate = [this.shopOrderStartDateFilterData.getFullYear(), this.shopOrderStartDateFilterData.getMonth() + 1, this.shopOrderStartDateFilterData.getDate()].join('-');
    let endDate = [this.shopOrderEndDateFilterData.getFullYear(), this.shopOrderEndDateFilterData.getMonth() + 1, this.shopOrderEndDateFilterData.getDate()].join('-');

    let shopGroupId: number = 0;
    if (this.cboShopGroup.selectedValue != null) {
      shopGroupId = this.cboShopGroup.selectedValue;
    }

    let shopOrderStatusId: number = 0;
    if (this.cboShopOrderStatus.selectedValue != null) {
      shopOrderStatusId = this.cboShopOrderStatus.selectedValue;
    }

    this.isProgressBarHidden = false;

    if (shopGroupId != 0 && shopOrderStatusId != 0) {
      this.trnShopOrderListService.listShopOrder(startDate, endDate, shopGroupId, shopOrderStatusId);
      this.listShopOrderSubscription = this.trnShopOrderListService.listShopOrderObservable.subscribe(
        data => {
          if (data.length > 0) {
            this.listShopOrderObservableArray = data;
            this.listShopOrderCollectionView = new CollectionView(this.listShopOrderObservableArray);
            this.listShopOrderCollectionView.pageSize = this.listShopPageIndex;
            this.listShopOrderCollectionView.trackChanges = true;
            this.listShopOrderCollectionView.refresh();
            this.listShopOrderFlexGrid.refresh();
          }

          this.isDataLoaded = true;

          this.isProgressBarHidden = true;
          if (this.listShopOrderSubscription != null) this.listShopOrderSubscription.unsubscribe();
        }
      );
    } else {
      this.isProgressBarHidden = true;
      this.toastr.error("Invalid filters.", "Error");
    }
  }

  // Import shop order
  public btnImportShopOrderClick(shopOrderImportModalTemplate: TemplateRef<any>): void {
    this.shopOrderImportModalRef = this.modalService.show(shopOrderImportModalTemplate, { class: "modal-xl" });

    this.importedCSVObservableArray = new ObservableArray();
    this.importedCSVCollectionView = new CollectionView(this.importedCSVObservableArray);
  }

  // Apply shop order
  public btnApplyImportShopOrderClick(shopOrderConfirmApplyModalTemplate: TemplateRef<any>) {
    this.shopOrderConfirmApplyModalRef = this.modalService.show(shopOrderConfirmApplyModalTemplate, { class: "modal-sm" });
  }

  // Confirm apply shop order
  public btnConfirmApplyShopOrderStatusClick() {
    let btnConfirmApplyShopOrderStatus: Element = document.getElementById("btnConfirmApplyShopOrderStatus");
    (<HTMLButtonElement>btnConfirmApplyShopOrderStatus).disabled = true;

    this.trnShopOrderListService.importShopOrder(JSON.stringify(this.importedCSVCollectionView.items));
    this.importShopOrderSubscription = this.trnShopOrderListService.importShopOrderObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Shop orders were successfully imported.", "Success");

          this.shopOrderConfirmApplyModalRef.hide();
          setTimeout(() => {
            this.shopOrderImportModalRef.hide();
            this.listShopOrder();
          }, 500);

        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnConfirmApplyShopOrderStatus).disabled = false;
        }

        if (this.importShopOrderSubscription != null) this.importShopOrderSubscription.unsubscribe();
      }
    );
  }

  // Change file listener
  public changeListener(files: FileList) {
    this.isLoadingImportCSVSpinnerHidden = false;

    if (files && files.length > 0) {
      let file: File = files.item(0);

      let reader: FileReader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (e) => {
        let csv: any = reader.result;
        let csvlines = csv.split(/\r|\n|\r/);

        let headers = csvlines[0].split(',');
        let dataLines: ObservableArray = new ObservableArray();

        for (let i = 1; i < csvlines.length; i++) {
          let data = csvlines[i].split(',');
          if (data.length === headers.length) {
            dataLines.push({
              SPDate: data[0],
              ItemCode: data[1],
              Quantity: data[2],
              Amount: data[3],
              ShopGroupCode: data[4],
              Particulars: data[5],
              ShopOrderStatusCode: data[6],
              ShopOrderStatusDate: data[7]
            });
          }
        }

        setTimeout(() => {
          this.isLoadingImportCSVSpinnerHidden = true;
          this.importedCSVObservableArray = dataLines;
          this.importedCSVCollectionView = new CollectionView(this.importedCSVObservableArray);
        }, 500);
      }
    } else {
      this.isLoadingImportCSVSpinnerHidden = true;
      this.importedCSVObservableArray = new ObservableArray();
      this.importedCSVCollectionView = new CollectionView(this.importedCSVObservableArray);
    }
  }

  // Add shop order
  public btnAddShopOrderClick(): void {
    let btnAddShopOrder: Element = document.getElementById("btnAddShopOrder");
    (<HTMLButtonElement>btnAddShopOrder).disabled = true;

    this.trnShopOrderListService.addShopOrder();
    this.addShopOrderSubscription = this.trnShopOrderListService.addShopOrderObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("New shop order was successfully added.", "Success");
          setTimeout(() => {
            this.router.navigate(['/software/trn-shop-order-detail', data[1]]);
          }, 500);
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnAddShopOrder).disabled = false;
        }

        if (this.addShopOrderSubscription != null) this.addShopOrderSubscription.unsubscribe();
      }
    );
  }

  // Edit shop order
  public btnEditShopOrderClick(): void {
    let currentShopOrder = this.listShopOrderCollectionView.currentItem;
    this.router.navigate(['/software/trn-shop-order-detail', currentShopOrder.Id]);
  }

  // Delete shop order
  public btnDeleteShopOrderClick(shopOrderDeleteModalTemplate: TemplateRef<any>): void {
    this.shopOrderDeleteModalRef = this.modalService.show(shopOrderDeleteModalTemplate, { class: "modal-sm" });

    let btnConfirmDeleteShopOrder: Element = document.getElementById("btnConfirmDeleteShopOrder");
    let btnCloseConfirmDeleteShopOrderModal: Element = document.getElementById("btnCloseConfirmDeleteShopOrderModal");
    (<HTMLButtonElement>btnConfirmDeleteShopOrder).disabled = false;
    (<HTMLButtonElement>btnCloseConfirmDeleteShopOrderModal).disabled = false;
  }

  // Confirm delete shop order
  public btnConfirmDeleteShopOrderStatusClick(): void {
    let btnConfirmDeleteShopOrder: Element = document.getElementById("btnConfirmDeleteShopOrder");
    let btnCloseConfirmDeleteShopOrderModal: Element = document.getElementById("btnCloseConfirmDeleteShopOrderModal");
    (<HTMLButtonElement>btnConfirmDeleteShopOrder).disabled = true;
    (<HTMLButtonElement>btnCloseConfirmDeleteShopOrderModal).disabled = true;

    let currentShopOrder = this.listShopOrderCollectionView.currentItem;
    this.trnShopOrderListService.deleteShopOrder(currentShopOrder.Id);
    this.deleteShopOrderSubscription = this.trnShopOrderListService.deleteShopOrderObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success("Shop order was successfully deleted.", "Success");

          this.shopOrderDeleteModalRef.hide();
          this.listShopOrder();
        } else if (data[0] == "failed") {
          this.toastr.error(data[1], "Error");

          (<HTMLButtonElement>btnConfirmDeleteShopOrder).disabled = false;
          (<HTMLButtonElement>btnCloseConfirmDeleteShopOrderModal).disabled = false;
        }

        if (this.deleteShopOrderSubscription != null) this.deleteShopOrderSubscription.unsubscribe();
      }
    );
  }

  // On page load
  ngOnInit() {
    this.createCboShowNumberOfRows();
    setTimeout(() => {
      this.softwareUserFormService.getCurrentForm("ShopOrderList");
      this.getUserFormsSubscription = this.softwareUserFormService.getCurrentUserFormsObservable.subscribe(
        data => {
          if (data != null) {
            this.isLoadingSpinnerHidden = true;
            this.isContentHidden = false;

            if (data.CanAdd) {
              this.isAddButtonHide = false;
            }

            if (data.CanAdd) {
              this.isAddButtonHide = false;
            }

            if (data.CanEdit) {
              this.isEditButtonHide = false;
              this.isShowEditColumn = true;
            }

            if (data.CanDelete) {
              this.isDeleteButtonHide = false;
              this.isShowDeleteColumn = true;
            }

            this.createCboShopGroup();
          } else {
            this.router.navigateByUrl("/software/err-forbidden", { skipLocationChange: true });
          }

          if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
        }
      );
    }, 1000);
  }

  // On page destroy
  ngOnDestroy() {
    if (this.cboShopGroupSubscription != null) this.cboShopGroupSubscription.unsubscribe();
    if (this.cboShopOrderStatusSubscription != null) this.cboShopOrderStatusSubscription.unsubscribe();
    if (this.listShopOrderSubscription != null) this.listShopOrderSubscription.unsubscribe();
    if (this.importShopOrderSubscription != null) this.importShopOrderSubscription.unsubscribe();
    if (this.addShopOrderSubscription != null) this.addShopOrderSubscription.unsubscribe();
    if (this.deleteShopOrderSubscription != null) this.deleteShopOrderSubscription.unsubscribe();
    if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
  }
}
