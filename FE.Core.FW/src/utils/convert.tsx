import { AreaModel, HeadQuarterModel, OptionModel, SelectOptionModel } from '@/@types/data';
import { CurrentUser } from '@/store/user';
import dayjs from 'dayjs';


export const ConvertHeaderQuarterOptionModel = (list: HeadQuarterModel[]) => {
  const items: SelectOptionModel[] = [];

  list.forEach((item: HeadQuarterModel) => {
    const access = getAcessHeaderQuater() as string[]
    if (access?.includes(item.id as string))
      items.push({
        value: item.id as string,
        label: item.name as string,
        key: item.id as string,
        parrentId: item.area.id as string
      });
  });

  return items;
};


export const ConvertIntToCurrencyFormat = (input: number) => {
  if (input == undefined) input = 0;
  const inputT = input.toString();
  const floatValue = parseFloat(inputT);
  let n = new Intl.NumberFormat('en-EN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(floatValue);

  if (inputT.includes('.') && !n.includes('.')) {
    return n + '.';
  }

  return n;
};



export function ConvertOptionSelectModel<T extends OptionModel>(list: T[]): SelectOptionModel[] {
  if (!list) return [];
  const items: SelectOptionModel[] = [];

  list.forEach((item: T) => {
    items.push({
      value: item.id as string,
      label: item.name as string,
      key: item.id as string,
    });
  });
  return items;
};


export function ConvertOptionModel<T extends { id: string, name: string }>(list: T[]): SelectOptionModel[] {

  if (!list) return [];
  const items: SelectOptionModel[] = [];

  list.forEach((item: T) => {
    items.push({
      value: item.id as string,
      label: item.name as string,
      title: item.name as string,
      key: item.id as string,
    });
  });
  return items;
};

export const base64toBlob = (b64Data: string, contentType = 'application/octet-stream', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export const getAcessHeaderQuater = () => {
  const userFromLocalStorage: CurrentUser = localStorage.getItem("permissionSetting") ? JSON.parse(localStorage.getItem("permissionSetting") as string) : ''

  if (userFromLocalStorage.accessDataHeaderQuater.length > 0)
    return userFromLocalStorage.accessDataHeaderQuater
  else
    return []
}

export const SumPriceString = (priceString: string) => {
  var sum = 0
  if (priceString != undefined) {
    priceString.split(",").forEach((item: string) => {
      sum += Number(item)
    })
  }
  return sum;
};
