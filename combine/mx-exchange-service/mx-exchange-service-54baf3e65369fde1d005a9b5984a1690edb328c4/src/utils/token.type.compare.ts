import { DcdtToken } from 'src/modules/tokens/models/dcdtToken.model';
import { NftCollection } from 'src/modules/tokens/models/nftCollection.model';
import { NftToken } from 'src/modules/tokens/models/nftToken.model';

export function leastType(typeA: string, typeB: string): string {
    switch (typeA) {
        case 'Core':
            return typeB;
        case 'Ecosystem':
            if (typeB === 'Core') {
                return typeA;
            }
            return typeB;
        case 'Community':
            if (typeB === 'Core' || typeB === 'Ecosystem') {
                return typeA;
            }
            return typeB;
        case 'Jungle-Community':
            if (
                typeB === 'Core' ||
                typeB === 'Ecosystem' ||
                typeB === 'Community'
            ) {
                return 'Community';
            }
            return typeB;
        case 'Experimental':
            if (
                typeB === 'Core' ||
                typeB === 'Ecosystem' ||
                typeB === 'Community' ||
                typeB === 'Jungle-Community'
            ) {
                return typeA;
            }
            return typeB;
        case 'Jungle-Experimental':
            if (
                typeB === 'Core' ||
                typeB === 'Ecosystem' ||
                typeB === 'Community' ||
                typeB === 'Jungle-Community' ||
                typeB === 'Experimental'
            ) {
                return 'Experimental';
            }
            return typeB;
        case 'Jungle':
            if (
                typeB === 'Core' ||
                typeB === 'Ecosystem' ||
                typeB === 'Community' ||
                typeB === 'Jungle-Community' ||
                typeB === 'Experimental' ||
                typeB === 'Jungle-Experimental'
            ) {
                return 'Experimental';
            }
            return typeB;
        case 'Unlisted':
            return typeA;
    }
}

export function isDcdtToken(
    token: DcdtToken | NftCollection | NftToken,
): token is DcdtToken {
    return (
        (token as DcdtToken).identifier !== undefined &&
        (token as NftToken).collection === undefined
    );
}

export function isNftCollection(
    token: DcdtToken | NftCollection | NftToken,
): token is NftCollection {
    return (
        (token as DcdtToken).identifier === undefined &&
        (token as NftCollection).collection !== undefined
    );
}

export function isNftToken(
    token: DcdtToken | NftCollection | NftToken,
): token is NftToken {
    return (
        (token as NftToken).identifier !== undefined &&
        (token as NftToken).collection !== undefined
    );
}

export function isDcdtTokenValid(token: DcdtToken): boolean {
    if (
        !token.identifier ||
        !token.decimals ||
        token.identifier === undefined ||
        token.decimals === undefined ||
        token.decimals === 0
    ) {
        return false;
    }
    return true;
}

export function isNftCollectionValid(
    collection: NftCollection | NftToken,
): boolean {
    if (
        !collection.decimals ||
        collection.decimals === undefined ||
        collection.decimals === 0
    ) {
        return false;
    }
    return true;
}
