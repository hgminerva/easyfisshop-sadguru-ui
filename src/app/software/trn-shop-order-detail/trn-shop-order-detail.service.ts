import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './../../app.settings';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { TrnShopOrderDetailModel } from './trn-shop-order-detail.model'
import { TrnShopOrderLineModel } from './trn-shop-order-line.model'

@Injectable({
  providedIn: 'root'
})
export class TrnShopOrderDetailService {
  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient
  ) { }

  // Request options
  public options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };
  public defaultAPIURLHost: string = this.appSettings.defaultAPIURLHost;

  // Subjects and Observables
  public listItemSource = new Subject<ObservableArray>();
  public listItemObservable = this.listItemSource.asObservable();
  public listUnitSource = new Subject<ObservableArray>();
  public listUnitObservable = this.listUnitSource.asObservable();
  public listShopGroupSource = new Subject<ObservableArray>();
  public listShopGroupObservable = this.listShopGroupSource.asObservable();
  public listShopOrderStatusSource = new Subject<ObservableArray>();
  public listShopOrderStatusObservable = this.listShopOrderStatusSource.asObservable();
  public detailShopOrderSource = new Subject<TrnShopOrderDetailModel>();
  public detailShopOrderObservable = this.detailShopOrderSource.asObservable();
  public saveShopOrderSource = new Subject<string[]>();
  public saveShopOrderObservable = this.saveShopOrderSource.asObservable();
  public lockShopOrderSource = new Subject<string[]>();
  public lockShopOrderObservable = this.lockShopOrderSource.asObservable();
  public unlockShopOrderSource = new Subject<string[]>();
  public unlockShopOrderObservable = this.unlockShopOrderSource.asObservable();
  public listShopOrderLineSource = new Subject<ObservableArray>();
  public listShopOrderLineObservable = this.listShopOrderLineSource.asObservable();
  public saveShopOrderLineSource = new Subject<string[]>();
  public saveShopOrderLineObservable = this.saveShopOrderLineSource.asObservable();
  public deleteShopOrderLineSource = new Subject<string[]>();
  public deleteShopOrderLineObservable = this.deleteShopOrderLineSource.asObservable();

  // List item
  public listItem(): void {
    let listItemObservableArray = new ObservableArray();
    this.listItemSource.next(listItemObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/shopOrder/dropdown/list/item", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listItemObservableArray.push({
              Id: results[i].Id,
              Item: results[i].Item,
              Code: results[i].Code,
              ManualCode: results[i].ManualCode,
              UnitId: results[i].UnitId
            });
          }
        }

        this.listItemSource.next(listItemObservableArray);
      }
    );
  }

  // List unit
  public listUnit(): void {
    let listUnitObservableArray = new ObservableArray();
    this.listUnitSource.next(listUnitObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/shopOrder/dropdown/list/unit", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listUnitObservableArray.push({
              Id: results[i].Id,
              Unit: results[i].Unit
            });
          }
        }

        this.listUnitSource.next(listUnitObservableArray);
      }
    );
  }

  // List shop group
  public listShopGroup(): void {
    let listShopGroupObservableArray = new ObservableArray();
    this.listShopGroupSource.next(listShopGroupObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/shopOrder/dropdown/list/shopOrderGroup", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listShopGroupObservableArray.push({
              Id: results[i].Id,
              ShopGroupCode: results[i].ShopGroupCode,
              ShopGroup: results[i].ShopGroup
            });
          }
        }

        this.listShopGroupSource.next(listShopGroupObservableArray);
      }
    );
  }

  // List shop order status
  public listShopOrderStatus(): void {
    let listShopOrderStatusObservableArray = new ObservableArray();
    this.listShopOrderStatusSource.next(listShopOrderStatusObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/shopOrder/dropdown/list/shopOrderStatus", this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listShopOrderStatusObservableArray.push({
              Id: results[i].Id,
              ShopOrderStatusCode: results[i].ShopOrderStatusCode,
              ShopOrderStatus: results[i].ShopOrderStatus
            });
          }
        }

        this.listShopOrderStatusSource.next(listShopOrderStatusObservableArray);
      }
    );
  }

  // Detail shop group
  public detailShopGroup(id: number): void {
    let trnShopOrderDetailModel: TrnShopOrderDetailModel;
    this.detailShopOrderSource.next(trnShopOrderDetailModel);

    this.httpClient.get(this.defaultAPIURLHost + "/api/shopOrder/detail/" + id, this.options).subscribe(
      response => {
        var results = response;
        if (results != null) {
          trnShopOrderDetailModel = {
            Id: results["Id"],
            Branch: results["Branch"],
            SPDate: results["SPDate"],
            SPNumber: results["SPNumber"],
            ItemId: results["ItemId"],
            Quantity: results["Quantity"],
            UnitId: results["UnitId"],
            Amount: results["Amount"],
            ShopOrderStatusId: results["ShopOrderStatusId"],
            ShopOrderStatusDate: results["ShopOrderStatusDate"],
            ShopGroupId: results["ShopGroupId"],
            Particulars: results["Particulars"],
            Status: results["Status"],
            IsLocked: results["IsLocked"],
            CreatedBy: results["CreatedBy"],
            CreatedDateTime: results["CreatedDateTime"],
            UpdatedBy: results["UpdatedBy"],
            UpdatedDateTime: results["UpdatedDateTime"]
          };
        }

        this.detailShopOrderSource.next(trnShopOrderDetailModel);
      }
    );
  }

  // Save shop group
  public saveShopGroup(objShopOrder: TrnShopOrderDetailModel): void {
    this.httpClient.put(this.defaultAPIURLHost + "/api/shopOrder/save", JSON.stringify(objShopOrder), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.saveShopOrderSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.saveShopOrderSource.next(errorResults);
      }
    );
  }

  // Lock shop group
  public lockShopGroup(objShopOrder: TrnShopOrderDetailModel): void {
    this.httpClient.put(this.defaultAPIURLHost + "/api/shopOrder/lock", JSON.stringify(objShopOrder), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.lockShopOrderSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.lockShopOrderSource.next(errorResults);
      }
    );
  }

  // Unlock shop group
  public unlockShopGroup(id: number): void {
    this.httpClient.put(this.defaultAPIURLHost + "/api/shopOrder/unlock?id=" + id, "", this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.unlockShopOrderSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.unlockShopOrderSource.next(errorResults);
      }
    );
  }

  // List shop order lime
  public listShopOrderLine(SPId: string): void {
    let listShopOrderLineObservableArray = new ObservableArray();
    this.listShopOrderLineSource.next(listShopOrderLineObservableArray);

    this.httpClient.get(this.defaultAPIURLHost + "/api/shopOrderLine/list/" + SPId, this.options).subscribe(
      response => {
        var results = response;
        if (results["length"] > 0) {
          for (var i = 0; i <= results["length"] - 1; i++) {
            listShopOrderLineObservableArray.push({
              Id: results[i].Id,
              SPId: results[i].SPId,
              ActivityDate: results[i].ActivityDate,
              Activity: results[i].Activity,
              User: results[i].User
            });
          }
        }

        this.listShopOrderLineSource.next(listShopOrderLineObservableArray);
      }
    );
  }

  // Save shop order line
  public saveShopOrderLine(objShopOrderLine: TrnShopOrderLineModel): void {
    if (objShopOrderLine.Id == 0) {
      this.httpClient.post(this.defaultAPIURLHost + "/api/shopOrderLine/add", JSON.stringify(objShopOrderLine), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", ""];
          this.saveShopOrderLineSource.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed", error["error"]];
          this.saveShopOrderLineSource.next(errorResults);
        }
      )
    } else {
      this.httpClient.put(this.defaultAPIURLHost + "/api/shopOrderLine/update", JSON.stringify(objShopOrderLine), this.options).subscribe(
        response => {
          let responseResults: string[] = ["success", ""];
          this.saveShopOrderLineSource.next(responseResults);
        },
        error => {
          let errorResults: string[] = ["failed", error["error"]];
          this.saveShopOrderLineSource.next(errorResults);
        }
      )
    }
  }

  // Delete shop order line
  public deleteShopOrderLine(id: number): void {
    this.httpClient.delete(this.defaultAPIURLHost + "/api/shopOrderLine/delete?id=" + id, this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.deleteShopOrderLineSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
        this.deleteShopOrderLineSource.next(errorResults);
      }
    )
  }
}