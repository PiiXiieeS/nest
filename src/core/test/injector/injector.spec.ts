import { expect } from "chai";
import { ModuleDependencies, InstanceWrapper } from "../../injector/container";
import { Injector } from "../../injector/injector";
import { Component } from "../../../common/utils/component.decorator";
import { RuntimeException } from "../../../errors/exceptions/runtime.exception";

describe('Injector', () => {
    let injector: Injector;

    beforeEach(() => {
        injector = new Injector();
    });

    describe('loadInstance', () => {

        @Component()
        class DependencyOne {}

        @Component()
        class DependencyTwo {}

        @Component()
        class MainTest {
            constructor(
                public depOne: DependencyOne,
                public depTwo: DependencyTwo) {}
        }

        let moduleDeps: ModuleDependencies;

        beforeEach(() => {
            moduleDeps = {
                instance: null,
                components: new Map<any, InstanceWrapper<any>>(),
            };
            moduleDeps.components.set(MainTest, {
                instance: Object.create(MainTest.prototype),
                isResolved: false
            });
            moduleDeps.components.set(DependencyOne, {
                instance: Object.create(DependencyOne.prototype),
                isResolved: false
            });
            moduleDeps.components.set(DependencyTwo, {
                instance: Object.create(DependencyOne.prototype),
                isResolved: false
            });
        });

        it('should create an instance of component with proper dependencies', () => {
            injector.loadInstance(MainTest, moduleDeps.components, moduleDeps);
            const { instance } = <InstanceWrapper<MainTest>>(moduleDeps.components.get(MainTest));

            expect(instance.depOne instanceof DependencyOne).to.be.true;
            expect(instance.depTwo instanceof DependencyOne).to.be.true;
            expect(instance instanceof MainTest).to.be.true;
        });

        it('should set "isResolved" property to true after instance initialization', () => {
            injector.loadInstance(MainTest, moduleDeps.components, moduleDeps);
            const { isResolved } = <InstanceWrapper<MainTest>>(moduleDeps.components.get(MainTest));
            expect(isResolved).to.be.true;
        });

        it('should throw RuntimeException when type is not stored in collection', () => {
            expect(
                injector.loadInstance.bind(injector, "Test", moduleDeps.components, moduleDeps)
            ).to.throw(RuntimeException);
        });

    });

    describe('loadPrototypeOfInstance', () => {

        @Component()
        class Test {}

        let moduleDeps: ModuleDependencies;

        beforeEach(() => {
            moduleDeps = {
                instance: null,
                components: new Map<any, InstanceWrapper<any>>(),
            };
            moduleDeps.components.set(Test, {
                instance: Object.create(Test.prototype),
                isResolved: false
            });
        });

        it('should create prototype of instance', () => {
            const expectedResult = {
                instance: Object.create(Test.prototype),
                isResolved: false
            };
            injector.loadPrototypeOfInstance(Test, moduleDeps.components);
            expect(moduleDeps.components.get(Test)).to.deep.equal(expectedResult);
        });
    });

});