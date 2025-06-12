import { Request, Response } from "express";
import { AddressLookupService, ZipCodeApiResponse } from "@api/services/AddressLookupService";
import { AddressLookupResponse } from "@shared/types";

export class AddressLookupController {
    private readonly _addressLookupService: AddressLookupService = new AddressLookupService();

    public async getAddressLookup(req: Request, res: Response): Promise<void> {
        const postalCode: string | undefined = req.query.postalCode as string;
        const houseNumber: string | undefined = req.query.houseNumber as string;

        if (!postalCode || !houseNumber) {
            res.status(400).json({ error: "Missing postalCode or houseNumber" });
            return;
        }

        const address: ZipCodeApiResponse = await this._addressLookupService.lookupAddress(
            "NL",
            postalCode,
            houseNumber
        );

        const response: AddressLookupResponse = {
            postalCode: postalCode,
            houseNumber: houseNumber,
            street: address.street,
            city: address.city,
        };

        res.json(response);
    }
}
