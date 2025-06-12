type ZipCodeApiRequest = {
    countryCode: string;
    postalCode: string;
    houseNumber: string;
};

export type ZipCodeApiResponse = {
    countryCode: string;
    postalCode: string;
    houseNumber: string;
    street: string;
    city: string;
    state: string;
};

export class AddressLookupService {
    public async lookupAddress(countryCode: string, postalCode: string, houseNumber: string): Promise<ZipCodeApiResponse> {
        const body: ZipCodeApiRequest = {
            countryCode: countryCode,
            postalCode: postalCode,
            houseNumber: houseNumber,
        };

        const response: Response = await fetch("https://zipcode.api.lucastars.hbo-ict.cloud/zipcode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer wiigiivuukii32",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch address: ${response.statusText}`);
        }

        const data: ZipCodeApiResponse = await response.json() as unknown as ZipCodeApiResponse;

        return data;
    }
}
