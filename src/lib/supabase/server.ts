// src/lib/supabase/server.ts
// 開発用のダミーSupabaseクライアント（チェーン可能＆await可能）
// 後で @supabase/supabase-js に置き換えます。

type SupabaseUser = { id: string; email?: string | null };

type ListResult<T = any> = { data: T[]; count: number | null; error: null };
type SingleResult<T = any> = { data: T | null; error: null };

function makeQueryBuilder() {
  // 内部状態（ここでは使わないが形だけ保持）
  const state: any = { table: null, filters: [] };

  // resolve時に返すダミーデータ
  const resolveList = (): ListResult => ({ data: [], count: 0, error: null });
  const resolveSingle = (): SingleResult => ({ data: null, error: null });

  // “thenable” にして await 可能にする
  const thenable: any = {
    select(_cols?: string, _opts?: { count?: "exact"; head?: boolean }) {
      state.select = { _cols, _opts };
      return thenable;
    },
    eq(_col?: string, _value?: any) {
      state.filters.push({ type: "eq", _col, _value });
      return thenable; // ★ チェーンを維持
    },
    order(_col?: string, _opts?: any) {
      state.order = { _col, _opts };
      return thenable;
    },
    range(_from?: number, _to?: number) {
      state.range = { _from, _to };
      return thenable;
    },
    // insert/update/delete は即Promiseを返す（awaitできる）
    insert(_values?: any): Promise<ListResult> {
      return Promise.resolve(resolveList());
    },
    update(_values?: any): Promise<ListResult> {
      return Promise.resolve(resolveList());
    },
    delete(): Promise<ListResult> {
      return Promise.resolve(resolveList());
    },
    // .single() は Promise を返す
    single(): Promise<SingleResult> {
      return Promise.resolve(resolveSingle());
    },
    // await されたときに呼ばれる（thenable）
    then(onFulfilled: (v: ListResult) => void, onRejected?: (e: any) => void) {
      try {
        const value = resolveList();
        return Promise.resolve(onFulfilled(value));
      } catch (e) {
        return onRejected ? Promise.resolve(onRejected(e)) : Promise.reject(e);
      }
    },
    catch(_fn: (e: any) => void) {
      // ダミー：ここに来ない想定
      return Promise.resolve();
    },
    finally(_fn: () => void) {
      return Promise.resolve();
    },
  };

  return thenable;
}

export function createClient() {
  return {
    auth: {
      async getUser(): Promise<{ data: { user: SupabaseUser | null } }> {
        // ログイン済みを仮定（未ログインテストは null に切替）
        return { data: { user: { id: "dev-user", email: "dev@mobpark.jp" } } };
      },
    },
    from(_table: string) {
      return makeQueryBuilder();
    },
  } as any;
}
