import { CountryInfoService } from './country-info.service';
export declare class CountryInfoController {
    private readonly countryInfoService;
    constructor(countryInfoService: CountryInfoService);
    getAvailableCountries(): Promise<any>;
    getCountryInfo(code: string): Promise<any>;
    getFlagByCode(name: string): Promise<any>;
    getPopulationByCountryName(name: string): Promise<any>;
}
