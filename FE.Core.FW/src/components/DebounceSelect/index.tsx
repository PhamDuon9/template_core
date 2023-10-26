import { ResponseData } from '@/apis';
import {
    Select,
    SelectProps,
    Spin
} from 'antd';
import { debounce } from 'lodash';
import { useMemo, useRef, useState } from 'react';


export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string, page: number) => Promise<ResponseData<ValueType[]>>;
    debounceTimeout?: number;
    onChange?: () => Promise<void>;
}
function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number | undefined } = any,
>({ fetchOptions, onChange, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    // const [hasContentLoading, setHasContentLoading] = useState(false);
    const [page, setPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);

    const [textSearch, setTextSearch] = useState<string>("");

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            setTextSearch(value);
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchOptions(value, 1).then((newOptions: ResponseData<ValueType[]>) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }
                setPage(newOptions.pageNumber as number);
                setTotalPage(newOptions.totalPage as number);
                setOptions(newOptions.data as ValueType[]);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            onChange={onChange}
            onPopupScroll={async (e: any) => {
                const { target } = e;
                if (
                    (target as any).scrollTop + (target as any).offsetHeight ===
                    (target as any).scrollHeight
                ) {
                    // if not load all;
                    if (page < totalPage) {
                        console.log("loading...");

                        setFetching(true);
                        await fetchOptions(textSearch, page + 1).then((newOptions: ResponseData<ValueType[]>) => {
                            options.push(...newOptions.data as ValueType[]);
                            setPage(newOptions.pageNumber as number);
                            setTotalPage(newOptions.totalPage as number);
                            setOptions([...options]);
                            setFetching(false);
                        });
                    }
                }
            }}
            onFocus={async (e: any) => {
                const { target } = e;
                debounceFetcher("")
            }}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
        />
    );
}

export default DebounceSelect
