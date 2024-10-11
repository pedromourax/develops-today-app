"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CountryInfoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryInfoService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let CountryInfoService = CountryInfoService_1 = class CountryInfoService {
    constructor(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(CountryInfoService_1.name);
    }
    async getFlagByName(name) {
        if (!name) {
            throw new Error('Country name not provided');
        }
        try {
            const flagsUrl = `https://countriesnow.space/api/v0.1/countries/flag/images`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(flagsUrl));
            const flag = response.data.data.find((flag) => flag.name === name);
            if (!flag) {
                return '';
            }
            return flag;
        }
        catch (error) {
            this.logger.error(`Error fetching the flag: ${error.message}`);
            throw new Error(`Error fetching the flag: ${error.message}`);
        }
    }
    async getAvailableCountries() {
        const url = 'https://date.nager.at/api/v3/AvailableCountries';
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
        const data = await Promise.all(response.data.map(async (country) => {
            try {
                const flag = await this.getFlagByName(country.name);
                return {
                    name: country.name,
                    code: country.countryCode,
                    flag: flag.flag,
                };
            }
            catch (error) {
                this.logger.error(`Error obtaining the flag for ${country.name}: ${error.message}`);
                return {
                    name: country.name,
                    code: country.countryCode,
                };
            }
        }));
        return data;
    }
    async getPopulationByCountryName(name) {
        try {
            const url = 'https://countriesnow.space/api/v0.1/countries/population';
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            const data = response.data.data.find((country) => country.country === name);
            if (!data)
                return null;
            return data.populationCounts;
        }
        catch (error) {
            this.logger.error(`Error fetching country population: ${error.message}`);
            throw new Error(`Error fetching country population: ${error.message}`);
        }
    }
    async getCountryInfo(code) {
        try {
            const url = `https://date.nager.at/api/v3/CountryInfo/${code}`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            response.data.borders = await Promise.all(response.data.borders.map(async (country) => {
                const flag = await this.getFlagByName(country.commonName);
                if (flag) {
                    return {
                        ...country,
                        flag: flag.flag,
                    };
                }
                return country;
            }));
            const flag = await this.getFlagByName(response.data.commonName);
            const population = await this.getPopulationByCountryName(response.data.commonName);
            if (population) {
                return { ...response.data, flag: flag.flag, population };
            }
            return { ...response.data, flag: flag.flag };
        }
        catch (error) {
            this.logger.error(`Error fetching country information: ${error.message}`);
            throw new Error(`Error fetching country information: ${error.message}`);
        }
    }
};
exports.CountryInfoService = CountryInfoService;
exports.CountryInfoService = CountryInfoService = CountryInfoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], CountryInfoService);
//# sourceMappingURL=country-info.service.js.map