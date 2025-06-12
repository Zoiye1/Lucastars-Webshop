import { AddressLookupResponse } from "@shared/types";

export class PostalCodeService {
    public async getAddressByPostalCode(postalCode: string, houseNumber: number | string): Promise<AddressLookupResponse> {
        const response: Response = await fetch(`${VITE_API_URL}address-lookup?postalCode=${postalCode}&houseNumber=${houseNumber}`, {
            credentials: "include",
        });

        const addressResponse: AddressLookupResponse = await response.json() as unknown as AddressLookupResponse;

        return addressResponse;
    }
}
