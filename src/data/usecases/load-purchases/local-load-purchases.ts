import { CacheStore } from "@/data/protocols/cache"
import { SavePurchases } from "../../../domain/usecases/save-purchases"
import { LoadPurchases } from "../../../domain/usecases/load-purchases"
import { CachePolicy } from "../../protocols/cache/cache.policy"

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
    private readonly key = 'purchases'

    constructor(
        private readonly cacheStore: CacheStore,
        private readonly currentDate: Date
    ) { }

    async save(purchases: Array<SavePurchases.Params>): Promise<void> {
        this.cacheStore.replace(this.key, {
            timeStamp: this.currentDate,
            value: purchases
        })
    }

    async loadAll(): Promise<Array<LoadPurchases.Result>> {
        try {
            const cache = this.cacheStore.fetch(this.key)
            return (CachePolicy.validate(cache.timeStamp, this.currentDate)) ? cache.value : []
        } catch (error) {
            return []
        }
    }

    validate(): void {
        try {
            const cache = this.cacheStore.fetch(this.key)
            if (!CachePolicy.validate(cache.timeStamp, this.currentDate)) {
                throw new Error
            }
        } catch (error) {
            this.cacheStore.delete(this.key)
        }
    }
}
