import {MemoryRepository} from "./memory";
import {isRight} from "fp-ts/Either";
import {OMEGAEvent} from "../../../types/types";

const cases: [string, OMEGAEvent[]][] = [
    [
        'Empty repo', []
    ],
]

describe("Memory OMEGAEvents repository - all OMEGAEvents", () => {
    test.each(cases)(
        "%p",
        (name, expected) => {
            const repo = new MemoryRepository(expected);

            const result = repo.all();

            if (!isRight(result)) {
                throw Error('Should have received a "right"');
            }

            expect(result.right).toEqual(expected);
        }
    )
})
