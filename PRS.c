#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_PRODUCTS 100
#define MAX_REVIEWS 50
#define MAX_STR_LEN 100
#define HASH_SIZE 50
#define MAX_HISTORY 50

typedef struct {
    char review[MAX_STR_LEN];
    float rating;
} ReviewEntry;

typedef struct Product {
    char productID[MAX_STR_LEN];
    char name[MAX_STR_LEN];
    ReviewEntry reviews[MAX_REVIEWS];
    int reviewCount;
    float avgRating;
    struct Product *next;
} Product;

Product *hashTable[HASH_SIZE] = {NULL};
Product *products[MAX_PRODUCTS];
int productCount = 0;

char searchHistory[MAX_HISTORY][20];
int searchCount = 0;

// Hash function
unsigned int hashFunc(const char *key) {
    unsigned int hash = 0;
    while (*key) {
        hash = (hash * 31 + *key) % HASH_SIZE;
        key++;
    }
    return hash;
}

// Convert ID to uppercase
void normalizeID(char *id) {
    for (int i = 0; id[i]; i++) {
        id[i] = toupper((unsigned char)id[i]);
    }
}

// Find product by ID
Product* findProduct(const char *productID) {
    unsigned int idx = hashFunc(productID);
    Product *p = hashTable[idx];
    while (p) {
        if (strcasecmp(p->productID, productID) == 0) return p;
        p = p->next;
    }
    return NULL;
}

// Insert product into hash table
void insertProduct(Product *p) {
    unsigned int idx = hashFunc(p->productID);
    p->next = hashTable[idx];
    hashTable[idx] = p;
}

// Add or update product review
void addProductReview(char *productID, char *name, float rating, char *review) {
    if (rating < 1.0 || rating > 5.0) {
        printf("Invalid rating! Must be between 1.0 and 5.0.\n");
        return;
    }

    normalizeID(productID);
    Product *p = findProduct(productID);

    if (p) { // Existing product
        for (int i = 0; i < p->reviewCount; i++) {
            if (strcmp(p->reviews[i].review, review) == 0) {
                printf("Duplicate review detected. Not added.\n");
                return;
            }
        }

        if (p->reviewCount >= MAX_REVIEWS) {
            printf("Max reviews reached.\n");
            return;
        }

        strcpy(p->reviews[p->reviewCount].review, review);
        p->reviews[p->reviewCount].rating = rating;
        p->reviewCount++;

        // Update average rating
        float sum = 0.0;
        for (int i = 0; i < p->reviewCount; i++)
            sum += p->reviews[i].rating;
        p->avgRating = sum / p->reviewCount;

        printf("Review added to existing product.\n");
    } else { // New product
        if (productCount >= MAX_PRODUCTS) {
            printf("Product limit reached.\n");
            return;
        }

        Product *newP = (Product *)malloc(sizeof(Product));
        strcpy(newP->productID, productID);
        strcpy(newP->name, name);
        newP->reviewCount = 1;
        strcpy(newP->reviews[0].review, review);
        newP->reviews[0].rating = rating;
        newP->avgRating = rating;
        newP->next = NULL;

        products[productCount++] = newP;
        insertProduct(newP);

        printf("New product added.\n");
    }
}

// Search for a product
void searchProduct() {
    char id[20];
    printf("Enter Product ID to search: ");
    scanf("%s", id);
    normalizeID(id);

    Product *p = findProduct(id);
    if (p) {
        printf("\nProduct Found:\n");
        printf("ID: %s | Name: %s | Avg Rating: %.2f\n", p->productID, p->name, p->avgRating);
        for (int i = 0; i < p->reviewCount; i++) {
            printf(" %.2f★ - %s\n", p->reviews[i].rating, p->reviews[i].review);
        }

        if (searchCount < MAX_HISTORY) {
            strcpy(searchHistory[searchCount++], id);
        }
    } else {
        printf("Product not found!\n");
    }
}

// Display top N rated products
void displayTopRated() {
    int n;
    printf("Enter N: ");
    scanf("%d", &n);

    if (n <= 0 || n > productCount) {
        printf("Invalid N!\n");
        return;
    }

    // Simple bubble sort by avgRating
    for (int i = 0; i < productCount - 1; i++) {
        for (int j = 0; j < productCount - i - 1; j++) {
            if (products[j]->avgRating < products[j + 1]->avgRating) {
                Product *temp = products[j];
                products[j] = products[j + 1];
                products[j + 1] = temp;
            }
        }
    }

    printf("\nTop %d Rated Products:\n", n);
    for (int i = 0; i < n; i++) {
        Product *p = products[i];
        printf("ID: %s | Name: %s | Avg Rating: %.2f\n", p->productID, p->name, p->avgRating);
    }
}

int main() {
    int choice;
    char pid[MAX_STR_LEN], name[MAX_STR_LEN], review[MAX_STR_LEN];
    float rating;

    while (1) {
        printf("\n--- Product Rating & Review System ---\n");
        printf("1. Add Rating & Review\n2. Search Product\n3. Display Top Rated\n4. Exit\nChoice: ");
        if (scanf("%d", &choice) != 1) break;

        switch (choice) {
            case 1:
                printf("Enter Product ID: ");
                scanf("%s", pid);
                printf("Enter Product Name: ");
                scanf(" %[^\n]", name);
                printf("Enter Rating (1.0-5.0): ");
                scanf("%f", &rating);
                printf("Enter Review: ");
                scanf(" %[^\n]", review);
                addProductReview(pid, name, rating, review);
                break;

            case 2:
                searchProduct();
                break;

            case 3:
                displayTopRated();
                break;

            case 4:
                printf("Exiting...\n");
                // Free allocated memory
                for (int i = 0; i < productCount; i++) free(products[i]);
                return 0;

            default:
                printf("Invalid choice.\n");
        }
    }
    return 0;
}
