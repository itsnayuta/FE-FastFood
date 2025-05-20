import { getCombos, getCategories } from './api';

export type MenuTab = {
    name: string;
    data: any[];
    type: 'combo' | 'category';
};

export const getMenuTabs = async () => {
    const combos = await getCombos();
    const categories = await getCategories();

    const comboTabs = Object.values(
        combos.reduce((groups: Record<string, any>, combo: any) => {
            if (!groups[combo.type]) {
                groups[combo.type] = {
                    name: combo.type,
                    data: [],
                    type: 'combo',
                    imageUrl: combo.imageUrl,
                };
            }
            groups[combo.type].data.push(combo);
            return groups;
        }, {})
    );

    const categoryTabs = categories.map((category: any) => ({
        name: category.name,
        data: [category],
        type: 'category',
        imageUrl: category.imageUrl,
    }));

    return [...comboTabs, ...categoryTabs];
};