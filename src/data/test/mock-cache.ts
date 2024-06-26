import { SavePurchases } from "@/domain/usecases"
import { CacheStore } from "../protocols/cache"

const maxAgeInDays = 3

export const getCacheExpirationDate = (timeStamp: Date): Date => {
    const maxCacheAge = new Date(timeStamp)
    maxCacheAge.setDate(maxCacheAge.getDate() - maxAgeInDays)
    return maxCacheAge
}

export class CacheStoreSpy implements CacheStore {
    actions: Array<CacheStoreSpy.Action> = []
    deleteCallsCount = 0
    insertCallsCount = 0
    deleteKey: string
    insertKey: string
    fetchKey: string
    insertValues: Array<SavePurchases.Params> = []
    fetchResult: any

    fetch(key: string): any {
        this.actions.push(CacheStoreSpy.Action.fetch)
        this.fetchKey = key
        return this.fetchResult
    }

    delete(key: string): void {
        this.actions.push(CacheStoreSpy.Action.delete)
        this.deleteKey = key
    }

    insert(key: string, value: any): void {
        this.actions.push(CacheStoreSpy.Action.insert)
        this.insertKey = key
        this.insertValues = value
    }

    replace(key: string, value: any): void {
        this.delete(key)
        this.insert(key, value)
    }

    simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
            this.actions.push(CacheStoreSpy.Action.delete)
            throw new Error()
        })
    }
    simulateInsartError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
            this.actions.push(CacheStoreSpy.Action.insert)
            throw new Error()
        })
    }
    simulateFetchError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'fetch').mockImplementationOnce(() => {
            this.actions.push(CacheStoreSpy.Action.fetch)
            throw new Error()
        })
    }
}

export namespace CacheStoreSpy {
    export enum Action {
        delete,
        insert,
        fetch
    }
}