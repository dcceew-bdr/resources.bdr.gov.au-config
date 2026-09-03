<script lang="ts" setup>
import { literal } from 'prez-lib';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { type ItemBreadcrumbProps } from "prez-components";

const props = defineProps<ItemBreadcrumbProps>();
const parents = props.parents;

const links = [...(props.prepend || []), ...(props.customItems ?
    // simplify customItems' labels into a literal object for standard rendering...
    props.customItems.map(item => ({...item, label: typeof(item.label) == 'string' ? literal(item.label) : item.label}))
    : parents || [])];

const textClassLast = 'whitespace-nowrap overflow-hidden text-ellipsis block';
const textClass = textClassLast + ' max-w-[14rem]';
const lastUrl = links[links.length - 1]?.url;
</script>

<template>
    <!-- ItemBreadcrumb -->
    <Breadcrumb v-if="links" class="breadcrumbs">
        <BreadcrumbList>
            <template v-for="item in links">
                <BreadcrumbItem>
                    <component :is="item.url != lastUrl ? BreadcrumbLink : BreadcrumbPage" as-child>
                        <Literal :term="typeof(item.label) == 'object' ? item.label : literal((item.label || item.segment || item.url) as string)">
                            <template #text="{ text }">
                                <ItemLink v-if="item.url != lastUrl || !item.url" :to="item.url" :class="`${textClass} breadcrumb-link`">
                                    {{ props.nameSubstitutions ? props.nameSubstitutions?.[text] || text : text }}
                                </ItemLink>
                                <span v-else :class="`${textClassLast} breadcrumb-page`">{{ props.nameSubstitutions ? props.nameSubstitutions?.[text] || text : text }}</span>
                            </template>
                        </Literal>
                    </component>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="item.url != lastUrl" class="breadcrumb-separator">
                    /
                </BreadcrumbSeparator>
            </template>
        </BreadcrumbList>
    </Breadcrumb>
</template>
